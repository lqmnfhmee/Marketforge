import economyImg from "../assets/economy.jpg";
import mamothImg from "../assets/mamoth.jpg";
import mountImg from "../assets/mount.jpg";
import skinImg from "../assets/skin.jpg";
import zvzImg from "../assets/zvz.jpg";

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import Sidebar from "../config/Sidebar";
import { usePockets } from "../components/context/PocketContext";
import { PlusCircle } from "lucide-react";

function CreatePocketPage() {
    const navigate = useNavigate();
    const { createPocket } = usePockets();

    const [name, setName] = useState("");
    const [goal, setGoal] = useState("");
    const [balance, setBalance] = useState("");
    const [selectedImage, setSelectedImage] = useState("");
    const [loading, setLoading] = useState(false);

    const images = [
        economyImg,
        mamothImg,
        mountImg,
        skinImg,
        zvzImg,
    ];

    const handleCreate = async () => {
        if (!name) {
            toast.error("Pocket name is required");
            return;
        }

        setLoading(true);
        const loadingToast = toast.loading("Creating pocket...");

        const res = await createPocket({
            name,
            goal: Number(goal),
            balance: Number(balance),
            image: selectedImage,
        });

        toast.dismiss(loadingToast);

        if (res && !res.success) {
            toast.error("Failed to create pocket");
            setLoading(false);
            return;
        }

        toast.success("Pocket created successfully");
        setLoading(false);
        navigate("/pockets");
    };

    return (
        <div className="flex bg-[#0b0f19] min-h-screen">
            <Sidebar />

            <div className="flex-1 p-4 sm:p-8 pt-18 lg:pt-8 pb-24 lg:pb-8">
                <div className="max-w-3xl mx-auto mt-6">
                    <h1 className="text-4xl font-bold text-white tracking-wide mb-2" style={{ fontFamily: "'Cinzel', serif" }}>
                        Establish Pocket
                    </h1>
                    <p className="text-gray-400 text-sm uppercase tracking-widest font-[Inter]">
                        Allocate silver for future investments
                    </p>

                    <div className="form-panel mt-10">
                        <div className="relative z-10">
                            
                            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">Choose Pocket Identity</label>
                            {/* Image Selection */}
                            <div className="flex flex-wrap gap-4 sm:gap-6 mb-10">
                                {images.map((image, index) => (
                                    <button
                                        key={index}
                                        onClick={() => setSelectedImage(image)}
                                        className={`
                                            w-20 h-20 sm:w-24 sm:h-24 rounded-full overflow-hidden border-2 transition-all duration-300
                                            ${selectedImage === image
                                                ? "border-[#fbbf24] shadow-[0_0_20px_rgba(251,191,36,0.3)] scale-110"
                                                : "border-transparent opacity-60 hover:opacity-100 hover:scale-105"
                                            }
                                        `}
                                    >
                                        <img src={image} className="w-full h-full object-cover" />
                                    </button>
                                ))}
                            </div>

                            {/* Form */}
                            <div className="space-y-6">
                                <div>
                                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Pocket Name</label>
                                    <input
                                        placeholder="e.g., Mammoth Fund"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        className="input-fantasy"
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Goal Amount (Optional)</label>
                                    <input
                                        type="text"
                                        placeholder="0"
                                        value={goal === '' || goal === undefined ? '' : Number(goal).toLocaleString()}
                                        onChange={(e) => {
                                            const rawValue = e.target.value.replace(/,/g, '');
                                            if (/^\d*$/.test(rawValue)) {
                                                setGoal(rawValue ? Number(rawValue) : '');
                                            }
                                        }}
                                        className="input-fantasy font-bold"
                                        style={{ fontFamily: "'Cinzel', serif" }}
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Initial Deposit (Optional)</label>
                                    <input
                                        type="text"
                                        placeholder="0"
                                        value={balance === '' || balance === undefined ? '' : Number(balance).toLocaleString()}
                                        onChange={(e) => {
                                            const rawValue = e.target.value.replace(/,/g, '');
                                            if (/^\d*$/.test(rawValue)) {
                                                setBalance(rawValue ? Number(rawValue) : '');
                                            }
                                        }}
                                        className="input-fantasy font-bold"
                                        style={{ fontFamily: "'Cinzel', serif" }}
                                    />
                                </div>
                            </div>

                            <button
                                onClick={handleCreate}
                                disabled={loading}
                                className="btn-primary w-full mt-10"
                            >
                                {loading ? "Creating..." : <><PlusCircle size={20}/> Create Pocket</>}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default CreatePocketPage;