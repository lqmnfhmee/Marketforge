import { useNavigate }
    from "react-router-dom";

function PocketCard({
    pocket,
}) {

    const navigate =
        useNavigate();

    return (
        <button
            onClick={() =>
                navigate(
                    `/pockets/${pocket.id}`
                )
            }
            className="
        bg-[#24163a]
        rounded-3xl
        p-6
        text-left
        text-white
        hover:scale-[1.02]
        transition
      "
        >

            {/* Image */}
            <div
                className="
          w-20
          h-20
          rounded-full
          bg-[#3b2a5a]
          mb-6
          overflow-hidden
        "
            >

                {pocket.image && (
                    <img
                        src={pocket.image}
                        className="
              w-full
              h-full
              object-cover
            "
                    />
                )}

            </div>

            {/* Name */}
            <h2 className="text-2xl font-bold">
                {pocket.name}
            </h2>

            {/* Balance */}
            <p className="text-3xl font-bold mt-4">
                {pocket.balance.toLocaleString()}
            </p>

            {/* Goal */}
            {pocket.goal_amount > 0 && (

                <div className="mt-4">

                    <div
                        className="
              w-full
              bg-[#1a1029]
              h-3
              rounded-full
            "
                    >

                        <div
                            className="
                bg-green-400
                h-3
                rounded-full
              "
                            style={{
                                width: `${Math.min(
                                    (
                                        pocket.balance /
                                        pocket.goal_amount
                                    ) * 100,
                                    100
                                )
                                    }%`,
                            }}
                        />

                    </div>

                    <p
                        className="
              text-sm
              text-gray-300
              mt-2
            "
                    >
                        Goal:{" "}
                        {pocket.goal_amount.toLocaleString()}
                    </p>

                </div>

            )}

        </button>
    );
}

export default PocketCard;