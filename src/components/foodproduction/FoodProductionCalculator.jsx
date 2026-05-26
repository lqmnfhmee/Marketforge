import { useState, useEffect } from "react";
import { useWallet } from "../context/WalletContext";
import { supabase } from "../../lib/supabase";
import toast from "react-hot-toast";

import FarmingExpenses from "./FarmingExpenses";
import CraftingExpenses from "./CraftingExpenses";
import SellingSetup from "./SellingSetup";
import ProfitSummary from "./ProfitSummary";
import SavedSessions from "./SavedSessions";
import SubmitModal from "./SubmitModal";

function FoodProductionCalculator() {
    const { addTransaction } = useWallet();

    /* -----------------------------
       Sessions & UI State
    ----------------------------- */
    const [sessions, setSessions] = useState([]);
    const [modalOpen, setModalOpen] = useState(false);
    const [modalData, setModalData] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        fetchSessions();
    }, []);

    const fetchSessions = async () => {
        const { data, error } = await supabase
            .from("food_production_sessions")
            .select("*")
            .order("created_at", { ascending: false });

        if (!error && data) {
            setSessions(data);
        }
    };    /* -----------------------------
       Farming
    ----------------------------- */
    const [babyAnimalCost,
        setBabyAnimalCost] =
        useState(0);

    const [foodCost,
        setFoodCost] =
        useState(0);

    const [seedCost,
        setSeedCost] =
        useState(0);

    const [travelCost,
        setTravelCost] =
        useState(0);

    /* -----------------------------
       Crafting
    ----------------------------- */
    const [butcherFee,
        setButcherFee] =
        useState(0);

    const [cookFee,
        setCookFee] =
        useState(0);

    const [ingredients,
        setIngredients] =
        useState([]);

    /* -----------------------------
       Selling
    ----------------------------- */
    const [itemName, setItemName] = useState("");
    const [craftedAmount, setCraftedAmount] = useState(0);


    const addIngredient =
        () => {

            setIngredients((prev) => [
                ...prev,
                {
                    name: "",
                    cost: 0,
                },
            ]);

        };

    const updateIngredient =
        (
            index,
            field,
            value
        ) => {

            const updated =
                [...ingredients];

            updated[index][field] =
                field === "cost"
                    ? Number(value)
                    : value;

            setIngredients(updated);
        };

    const removeIngredient =
        (index) => {

            setIngredients(
                ingredients.filter(
                    (_, i) =>
                        i !== index
                )
            );

        };

    /* -----------------------------
       Calculations
    ----------------------------- */

    const ingredientTotal =
        ingredients.reduce(
            (acc, ingredient) =>
                acc +
                ingredient.cost,
            0
        );

    const farmingCost =
        Number(babyAnimalCost) +
        Number(foodCost) +
        Number(seedCost) +
        Number(travelCost);

    const craftingCost =
        Number(butcherFee) +
        Number(cookFee) +
        ingredientTotal;

    const totalExpenses = farmingCost + craftingCost;

    /* -----------------------------
       Actions
    ----------------------------- */
    const handleSaveSession = async () => {
        if (!itemName.trim()) {
            toast.error("Please enter a product name before saving.");
            return;
        }

        const newSession = {
            item_name: itemName.trim(),
            crafted_amount: Number(craftedAmount) || 0,
            baby_animal_cost: Number(babyAnimalCost) || 0,
            food_cost: Number(foodCost) || 0,
            seed_cost: Number(seedCost) || 0,
            travel_cost: Number(travelCost) || 0,
            butcher_fee: Number(butcherFee) || 0,
            cook_fee: Number(cookFee) || 0,
            farming_expenses: farmingCost,
            crafting_expenses: craftingCost,
            ingredients: ingredients,          // stored as jsonb in Supabase
            total_expenses: totalExpenses,
            sale_status: "pending",
            actual_silver_received: null,
            profit: null,
        };

        const loadingToast = toast.loading("Saving production session...");

        const { data, error } = await supabase
            .from("food_production_sessions")
            .insert([newSession])
            .select()
            .single();

        toast.dismiss(loadingToast);

        if (error) {
            console.error("Supabase insert error:", error);
            toast.error(`Failed to save production session. ${error.message || ""}`);
            return;
        }

        // Prepend returned row (with server-assigned id + created_at) to state
        setSessions((prev) => [data, ...prev]);
        toast.success("Production session saved!");

        // Clear the form so it's ready for the next production run
        setItemName("");
        setCraftedAmount(0);
        setBabyAnimalCost(0);
        setFoodCost(0);
        setSeedCost(0);
        setTravelCost(0);
        setButcherFee(0);
        setCookFee(0);
        setIngredients([]);
    };


    const loadSession = (session) => {
        setItemName(session.item_name || "");
        setCraftedAmount(session.crafted_amount || 0);
        setBabyAnimalCost(session.baby_animal_cost || 0);
        setFoodCost(session.food_cost || 0);
        setSeedCost(session.seed_cost || 0);
        setTravelCost(session.travel_cost || 0);
        setButcherFee(session.butcher_fee || 0);
        setCookFee(session.cook_fee || 0);
        setIngredients(session.ingredients || []);
        window.scrollTo({ top: 0, behavior: "smooth" });
        showToast("Session loaded!");
    };

    const handleOpenModal = (type) => {
        const amount = type === "farming" ? farmingCost : craftingCost;
        if (amount <= 0) {
            showToast("Amount must be greater than 0", true);
            return;
        }

        const category = type === "farming" ? "Ingredient Purchase" : "Craft Fee";
        
        const hideConfirm = localStorage.getItem("hideFoodSubmitConfirm") === "true";
        if (hideConfirm) {
            submitTransaction(type, amount, category);
        } else {
            setModalData({
                sessionType: type,
                amount,
                category,
                itemName: itemName || "Food Production"
            });
            setModalOpen(true);
        }
    };

    const submitTransaction = async (type, amount, category) => {
        setIsSubmitting(true);
        const note = `Food Production ${type === "farming" ? "Farming" : "Crafting"} Session - ${itemName || "Unnamed"}`;
        
        const tx = {
            type: "expense",
            category,
            amount,
            note
        };
        
        const loadingToast = toast.loading("Saving transaction...");
        
        const res = await addTransaction(tx);
        
        toast.dismiss(loadingToast);
        
        setIsSubmitting(false);
        setModalOpen(false);
        
        if (res.success) {
            showToast("Transaction submitted successfully!");
        } else {
            showToast("Failed to submit transaction", true);
        }
    };

    const showToast = (message, isError = false) => {
        if (isError) {
            toast.error(message);
        } else {
            toast.success(message);
        }
    };

    return (

        <div className="pb-20">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">

            {/* LEFT */}
            <div className="lg:col-span-2 space-y-6">

                <FarmingExpenses
                    babyAnimalCost={babyAnimalCost}
                    setBabyAnimalCost={
                        setBabyAnimalCost
                    }

                    foodCost={foodCost}
                    setFoodCost={
                        setFoodCost
                    }

                    seedCost={seedCost}
                    setSeedCost={
                        setSeedCost
                    }

                    travelCost={travelCost}
                    setTravelCost={setTravelCost}
                    onSubmitTransaction={() => handleOpenModal("farming")}
                    isSubmitting={isSubmitting && modalData?.sessionType === "farming"}
                />

                <CraftingExpenses
                    butcherFee={butcherFee}
                    setButcherFee={
                        setButcherFee
                    }

                    cookFee={cookFee}
                    setCookFee={
                        setCookFee
                    }

                    ingredients={ingredients}

                    addIngredient={
                        addIngredient
                    }

                    updateIngredient={
                        updateIngredient
                    }

                    removeIngredient={removeIngredient}
                    onSubmitTransaction={() => handleOpenModal("crafting")}
                    isSubmitting={isSubmitting && modalData?.sessionType === "crafting"}
                />

                <div className="pt-2">
                    <button
                        onClick={handleSaveSession}
                        className="btn-primary w-full shadow-[0_0_20px_rgba(251,191,36,0.15)]"
                    >
                        Save Session
                    </button>
                </div>

            </div>

            {/* RIGHT */}
            <div className="space-y-6">

                <SellingSetup
                    itemName={itemName}
                    setItemName={setItemName}
                    craftedAmount={craftedAmount}
                    setCraftedAmount={setCraftedAmount}
                />

                <ProfitSummary
                    farmingCost={farmingCost}
                    craftingCost={craftingCost}
                    totalExpenses={totalExpenses}
                />

            </div>

        </div>

        {/* Production Sessions */}
        <SavedSessions sessions={sessions} setSessions={setSessions} />

        {/* Modal */}
        <SubmitModal 
            isOpen={modalOpen} 
            modalData={modalData} 
            onClose={() => setModalOpen(false)} 
            onSubmit={() => submitTransaction(modalData?.sessionType, modalData?.amount, modalData?.category)} 
        />

        </div>
    );
}

export default FoodProductionCalculator;