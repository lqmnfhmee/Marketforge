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
    const [actualSilverReceived, setActualSilverReceived] = useState(0);


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
       Profit  (real silver, no tax simulation)
    ----------------------------- */

    const profit = Number(actualSilverReceived || 0) - totalExpenses;

    const roi =
        totalExpenses > 0
            ? ((profit / totalExpenses) * 100).toFixed(1)
            : 0;

    /* -----------------------------
       Actions
    ----------------------------- */
    const handleSaveSession = async () => {
        const newSession = {
            item_name: itemName,
            crafted_amount: craftedAmount,
            baby_animal_cost: babyAnimalCost,
            food_cost: foodCost,
            seed_cost: seedCost,
            travel_cost: travelCost,
            butcher_fee: butcherFee,
            cook_fee: cookFee,
            farming_expenses: farmingCost,
            crafting_expenses: craftingCost,
            ingredients,
            actual_silver_received: actualSilverReceived,
            total_expenses: totalExpenses,
            profit,
            created_at: new Date().toISOString()
        };
        
        const loadingToast = toast.loading("Saving session...");
        
        const { data, error } = await supabase
            .from("food_production_sessions")
            .insert([newSession])
            .select();

        toast.dismiss(loadingToast);

        if (error) {
            console.error("Error saving session:", error);
            showToast("Failed to save session", true);
        } else if (data && data.length > 0) {
            setSessions([data[0], ...sessions]);
            showToast("Session saved successfully!");
        }
    };

    const loadSession = (session) => {
        setItemName(session.item_name || session.itemName || "");
        setCraftedAmount(session.crafted_amount || session.craftedAmount || 0);
        setBabyAnimalCost(session.baby_animal_cost || session.babyAnimalCost || 0);
        setFoodCost(session.food_cost || session.foodCost || 0);
        setSeedCost(session.seed_cost || session.seedCost || 0);
        setTravelCost(session.travel_cost || session.travelCost || 0);
        setButcherFee(session.butcher_fee || session.butcherFee || 0);
        setCookFee(session.cook_fee || session.cookFee || 0);
        setIngredients(session.ingredients || []);
        setActualSilverReceived(session.actual_silver_received || 0);
        window.scrollTo({ top: 0, behavior: "smooth" });
        showToast("Session loaded successfully!");
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
                    actualSilverReceived={actualSilverReceived}
                    setActualSilverReceived={setActualSilverReceived}
                />

                <ProfitSummary
                    profit={profit}
                    roi={roi}
                    totalExpenses={totalExpenses}
                    actualSilverReceived={actualSilverReceived}
                />

            </div>

        </div>

        {/* Saved Sessions Section */}
        <SavedSessions sessions={sessions} setSessions={setSessions} onLoadSession={loadSession} />

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