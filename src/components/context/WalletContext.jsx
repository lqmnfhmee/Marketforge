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

const WalletContext =
  createContext(null);

export function WalletProvider({
  children,
}) {

  const { user } =
    useAuth();

  /* -----------------------------
     Initial Balances
  ----------------------------- */

  const [silverBalance,
    setSilverBalance] =
    useState(0);

  const [goldBalance,
    setGoldBalance] =
    useState(0);

  /* -----------------------------
     Transactions
  ----------------------------- */

  const [transactions,
    setTransactions] =
    useState([]);

  const [loading,
    setLoading] =
    useState(true);

  /* -----------------------------
     Fetch Transactions
  ----------------------------- */

  async function fetchTransactions() {

    if (!user) {

      setLoading(false);

      return;
    }

    setLoading(true);

    const {
      data,
      error,
    } = await supabase
      .from("transactions")
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

    } else {

      setTransactions(data);

      /* -----------------------------
         Recalculate Silver Balance
      ----------------------------- */

      const calculatedSilver =
        data.reduce(
          (sum, tx) => {

            return tx.type ===
              "income"
              ? sum +
              Number(
                tx.amount
              )
              : sum -
              Number(
                tx.amount
              );

          },
          0
        );

      setSilverBalance(
        calculatedSilver
      );
    }

    setLoading(false);
  }

  useEffect(() => {

    if (user) {

      fetchTransactions();

    } else {

      setTransactions([]);

      setSilverBalance(0);

      setGoldBalance(0);

      setLoading(false);
    }

  }, [user]);

  /* -----------------------------
     Add Transaction
  ----------------------------- */

  async function addTransaction(
    tx
  ) {

    if (!user) {

      return {
        success: false,
      };
    }

    const {
      error,
    } = await supabase
      .from("transactions")
      .insert([
        {
          user_id: user.id,

          type: tx.type,

          category:
            tx.category,

          amount:
            tx.amount,

          note: tx.note,
        },
      ]);

    if (error) {

      console.error(error);

      return {
        success: false,
      };
    }

    await fetchTransactions();

    return {
      success: true,
    };
  }

  /* -----------------------------
     Silver Balance
  ----------------------------- */

  function getSilverBalance() {

    return silverBalance;
  }

  /* -----------------------------
     Weekly Profit Change
  ----------------------------- */

  function getWeeklyChange() {

    const oneWeekAgo =
      Date.now() -
      7 *
      24 *
      60 *
      60 *
      1000;

    return transactions
      .filter(
        (t) =>
          new Date(
            t.created_at ||
            t.timestamp
          ).getTime() >=
          oneWeekAgo &&
          t.category !== "Balance Adjustment"
      )
      .reduce(
        (sum, t) => {

          return t.type ===
            "income"
            ? sum +
            Number(
              t.amount
            )
            : sum -
            Number(
              t.amount
            );

        },
        0
      );
  }

  /* -----------------------------
     Update Gold Balance
  ----------------------------- */

  function updateGoldBalance(
    amount
  ) {

    if (
      amount < 0 ||
      isNaN(amount)
    ) {

      return {
        success: false,

        message:
          "Invalid amount",
      };
    }

    setGoldBalance(amount);

    return {
      success: true,
    };
  }

  /* -----------------------------
     Buy Gold With Silver
  ----------------------------- */

  function buyGold({
    goldPrice,
    silverAmount,
  }) {

    if (
      !goldPrice ||
      goldPrice <= 0
    ) {

      return {
        success: false,

        message:
          "Invalid gold price",
      };
    }

    if (
      !silverAmount ||
      silverAmount <= 0
    ) {

      return {
        success: false,

        message:
          "Invalid silver amount",
      };
    }

    if (
      silverAmount >
      silverBalance
    ) {

      return {
        success: false,

        message:
          "Not enough silver",
      };
    }

    const goldReceived =
      Math.floor(
        silverAmount /
        goldPrice
      );

    setSilverBalance(
      (prev) =>
        prev -
        silverAmount
    );

    setGoldBalance(
      (prev) =>
        prev +
        goldReceived
    );

    return {
      success: true,

      goldReceived,
    };
  }

  /* -----------------------------
     Sell Gold For Silver
  ----------------------------- */

  function buySilver({
    goldPrice,
    goldAmount,
  }) {

    if (
      !goldPrice ||
      goldPrice <= 0
    ) {

      return {
        success: false,

        message:
          "Invalid gold price",
      };
    }

    if (
      !goldAmount ||
      goldAmount <= 0
    ) {

      return {
        success: false,

        message:
          "Invalid gold amount",
      };
    }

    if (
      goldAmount >
      goldBalance
    ) {

      return {
        success: false,

        message:
          "Not enough gold",
      };
    }

    const silverReceived =
      goldPrice *
      goldAmount;

    setGoldBalance(
      (prev) =>
        prev -
        goldAmount
    );

    setSilverBalance(
      (prev) =>
        prev +
        silverReceived
    );

    return {
      success: true,

      silverReceived,
    };
  }

  return (

    <WalletContext.Provider
      value={{

        transactions,

        loading,

        addTransaction,

        silverBalance:
          getSilverBalance(),

        getSilverBalance,

        getWeeklyChange,

        goldBalance,

        setGoldBalance,

        setSilverBalance,

        buyGold,

        buySilver,
      }}
    >

      {children}

    </WalletContext.Provider>

  );
}

export function useWallet() {

  const ctx =
    useContext(
      WalletContext
    );

  if (!ctx) {

    throw new Error(
      "useWallet must be used inside WalletProvider"
    );
  }

  return ctx;
}