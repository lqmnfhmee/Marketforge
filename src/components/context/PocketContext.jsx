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

import { useWallet }
    from "./WalletContext";

const PocketContext =
    createContext(null);

export function PocketProvider({
    children,
}) {

    const { user } =
        useAuth();

    const { silverBalance, fetchTransactions } =
        useWallet();


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

        const activePockets = pocketsData.filter(p => p.is_archived !== true);

        const pocketsWithActivities =
            await Promise.all(

                activePockets.map(
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

            // Fetch the authenticated user directly to ensure correct ID
            const { data: { user: currentUser } } = await supabase.auth.getUser();

            if (!currentUser) {

                return {
                    success: false,
                    error: "Not authenticated",
                };
            }

            const payload = {
                user_id: currentUser.id,
                name: pocket.name,
                goal_amount: pocket.goal || 0,
                goal: pocket.goal || 0,
                balance: pocket.balance || 0,
            };

            if (pocket.image) {
                payload.image = pocket.image;
            }

            const {
                data,
                error,
            } = await supabase
                .from("pockets")
                .insert([payload])
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
       — moves money OUT of main balance INTO pocket
    ----------------------------- */

    const depositToPocket =
        async (
            pocketId,
            amount
        ) => {

            if (!user)
                return { success: false, error: "Not authenticated" };

            const pocket =
                pockets.find(
                    (p) =>
                        p.id ===
                        pocketId
                );

            if (!pocket)
                return { success: false, error: "Pocket not found" };

            /* Validate: cannot deposit more than main balance */
            if (Number(amount) > silverBalance) {
                return {
                    success: false,
                    error: `Insufficient main balance. Available: ${silverBalance.toLocaleString()} silver`,
                };
            }

            const newPocketBalance =
                Number(pocket.balance) + Number(amount);

            /* 1. Deduct from main wallet via transactions table */
            const { error: txError } = await supabase
                .from("transactions")
                .insert([{
                    user_id:  user.id,
                    type:     "expense",
                    category: "Pocket Transfer",
                    amount:   Number(amount),
                    note:     `Transferred ${Number(amount).toLocaleString()} to pocket: ${pocket.name}`,
                }]);

            if (txError) {
                console.error("depositToPocket tx error:", txError);
                return { success: false, error: txError.message };
            }

            /* 2. Update pocket balance */
            await supabase
                .from("pockets")
                .update({ balance: newPocketBalance })
                .eq("id", pocketId)
                .eq("user_id", user.id);

            /* 3. Log pocket activity */
            await supabase
                .from("pocket_activities")
                .insert([{
                    user_id:   user.id,
                    pocket_id: pocketId,
                    type:      "deposit",
                    amount,
                }]);

            /* Refresh both contexts */
            await fetchTransactions();
            await fetchPockets();

            return { success: true };
        };

    /* -----------------------------
       Withdraw Silver
       — moves money OUT of pocket BACK TO main balance
    ----------------------------- */

    const withdrawFromPocket =
        async (
            pocketId,
            amount
        ) => {

            if (!user)
                return { success: false, error: "Not authenticated" };

            const pocket =
                pockets.find(
                    (p) =>
                        p.id ===
                        pocketId
                );

            if (!pocket)
                return { success: false, error: "Pocket not found" };

            /* Validate: cannot withdraw more than pocket balance */
            if (Number(amount) > Number(pocket.balance)) {
                return {
                    success: false,
                    error: `Insufficient pocket balance. Available: ${Number(pocket.balance).toLocaleString()} silver`,
                };
            }

            const newPocketBalance =
                Number(pocket.balance) - Number(amount);

            /* 1. Add to main wallet via transactions table */
            const { error: txError } = await supabase
                .from("transactions")
                .insert([{
                    user_id:  user.id,
                    type:     "income",
                    category: "Pocket Transfer",
                    amount:   Number(amount),
                    note:     `Withdrew ${Number(amount).toLocaleString()} from pocket: ${pocket.name}`,
                }]);

            if (txError) {
                console.error("withdrawFromPocket tx error:", txError);
                return { success: false, error: txError.message };
            }

            /* 2. Update pocket balance */
            await supabase
                .from("pockets")
                .update({ balance: newPocketBalance })
                .eq("id", pocketId)
                .eq("user_id", user.id);

            /* 3. Log pocket activity */
            await supabase
                .from("pocket_activities")
                .insert([{
                    user_id:   user.id,
                    pocket_id: pocketId,
                    type:      "withdraw",
                    amount,
                }]);

            /* Refresh both contexts */
            await fetchTransactions();
            await fetchPockets();

            return { success: true };
        };

    /* -----------------------------
       Update Pocket (Settings)
    ----------------------------- */

    const updatePocket = async (pocketId, updates) => {
        if (!user) return { success: false, error: "Not authenticated" };

        const { error } = await supabase
            .from("pockets")
            .update(updates)
            .eq("id", pocketId)
            .eq("user_id", user.id);

        if (error) {
            console.error("updatePocket error:", error);
            return { success: false, error: error.message };
        }

        await fetchPockets();
        return { success: true };
    };

    /* -----------------------------
       Close Pocket (Archive)
    ----------------------------- */

    const closePocket = async (pocketId) => {
        if (!user) return { success: false, error: "Not authenticated" };

        const { error } = await supabase
            .from("pockets")
            .update({ is_archived: true })
            .eq("id", pocketId)
            .eq("user_id", user.id);

        if (error) {
            console.error("closePocket error:", error);
            return { success: false, error: error.message };
        }

        await fetchPockets();
        return { success: true };
    };

    return (

        <PocketContext.Provider
            value={{

                pockets,

                loading,

                createPocket,

                depositToPocket,

                withdrawFromPocket,

                updatePocket,

                closePocket,

                fetchPockets,
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