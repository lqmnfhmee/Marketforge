import {
    createContext,
    useContext,
    useState,
    useEffect,
} from "react";

import { supabase }
    from "../../lib/supabase";

import { useAuth }
    from "./AuthContext";

const PocketContext =
    createContext(null);

export function PocketProvider({
    children,
}) {

    const { user } =
        useAuth();

    const [pockets,
        setPockets] =
        useState([]);

    const [loading,
        setLoading] =
        useState(true);

    /* -----------------------------
       Fetch Pockets
    ----------------------------- */

    async function fetchPockets() {

        if (!user) {

            setLoading(false);

            return;
        }

        setLoading(true);

        const {
            data: pocketsData,
            error,
        } = await supabase
            .from("pockets")
            .select("*")
            .eq(
                "user_id",
                user.id
            )
            .order(
                "created_at",
                {
                    ascending: false,
                }
            );

        if (error) {

            console.error(error);

            setLoading(false);

            return;
        }

        /* -----------------------------
           Fetch Activities
        ----------------------------- */

        const pocketsWithActivities =
            await Promise.all(

                pocketsData.map(
                    async (pocket) => {

                        const {
                            data:
                            activityData,
                        } =
                            await supabase
                                .from(
                                    "pocket_activities"
                                )
                                .select(
                                    "*"
                                )
                                .eq(
                                    "pocket_id",
                                    pocket.id
                                )
                                .eq(
                                    "user_id",
                                    user.id
                                )
                                .order(
                                    "created_at",
                                    {
                                        ascending: false,
                                    }
                                );

                        return {
                            ...pocket,

                            activity:
                                activityData || [],
                        };
                    }
                )
            );

        setPockets(
            pocketsWithActivities
        );

        setLoading(false);
    }

    useEffect(() => {

        if (user) {

            fetchPockets();

        } else {

            setPockets([]);

            setLoading(false);
        }

    }, [user]);

    /* -----------------------------
       Create Pocket
    ----------------------------- */

    const createPocket =
        async (pocket) => {

            if (!user) {

                return {
                    success: false,
                };
            }

            const {
                data,
                error,
            } = await supabase
                .from("pockets")
                .insert([
                    {
                        user_id:
                            user.id,

                        name:
                            pocket.name,

                        image:
                            pocket.image,

                        goal:
                            pocket.goal || 0,

                        balance:
                            pocket.balance ||
                            0,
                    },
                ])
                .select()
                .single();

            if (error) {

                console.error("createPocket error:", error);

                return {
                    success: false,
                    error: error.message || JSON.stringify(error),
                };
            }

            /* -----------------------------
               Add Initial Deposit Activity
            ----------------------------- */

            if (
                pocket.balance &&
                pocket.balance > 0
            ) {

                await supabase
                    .from(
                        "pocket_activities"
                    )
                    .insert([
                        {
                            user_id:
                                user.id,

                            pocket_id:
                                data.id,

                            type:
                                "deposit",

                            amount:
                                pocket.balance,
                        },
                    ]);
            }

            await fetchPockets();

            return {
                success: true,
            };
        };

    /* -----------------------------
       Deposit Silver
    ----------------------------- */

    const depositToPocket =
        async (
            pocketId,
            amount
        ) => {

            if (!user)
                return;

            const pocket =
                pockets.find(
                    (p) =>
                        p.id ===
                        pocketId
                );

            if (!pocket)
                return;

            const newBalance =
                Number(
                    pocket.balance
                ) + Number(amount);

            /* Update Pocket Balance */

            await supabase
                .from("pockets")
                .update({
                    balance:
                        newBalance,
                })
                .eq(
                    "id",
                    pocketId
                )
                .eq(
                    "user_id",
                    user.id
                );

            /* Add Activity */

            await supabase
                .from(
                    "pocket_activities"
                )
                .insert([
                    {
                        user_id:
                            user.id,

                        pocket_id:
                            pocketId,

                        type:
                            "deposit",

                        amount,
                    },
                ]);

            await fetchPockets();
        };

    /* -----------------------------
       Withdraw Silver
    ----------------------------- */

    const withdrawFromPocket =
        async (
            pocketId,
            amount
        ) => {

            if (!user)
                return;

            const pocket =
                pockets.find(
                    (p) =>
                        p.id ===
                        pocketId
                );

            if (!pocket)
                return;

            const newBalance =
                Number(
                    pocket.balance
                ) - Number(amount);

            await supabase
                .from("pockets")
                .update({
                    balance:
                        newBalance,
                })
                .eq(
                    "id",
                    pocketId
                )
                .eq(
                    "user_id",
                    user.id
                );

            await supabase
                .from(
                    "pocket_activities"
                )
                .insert([
                    {
                        user_id:
                            user.id,

                        pocket_id:
                            pocketId,

                        type:
                            "withdraw",

                        amount,
                    },
                ]);

            await fetchPockets();
        };

    return (

        <PocketContext.Provider
            value={{

                pockets,

                loading,

                createPocket,

                depositToPocket,

                withdrawFromPocket,
            }}
        >

            {children}

        </PocketContext.Provider>
    );
}

export function usePockets() {

    const ctx =
        useContext(
            PocketContext
        );

    if (!ctx) {

        throw new Error(
            "usePockets must be used inside PocketProvider"
        );
    }

    return ctx;
}