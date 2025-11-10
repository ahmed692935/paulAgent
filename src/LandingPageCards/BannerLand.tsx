import soundImg from "../assets/Images/soundwave.webp"

function BannerLand() {
    return (
        <div className="py-16 px-4 md:px-8 bg-white text-center">
            <div className="max-w-7xl mx-auto w-full">
                <div className="relative w-full h-[15rem] sm:h-[22rem] md:h-[30rem]">
                    <img
                        src={soundImg}
                        alt="sound wave"
                        loading="lazy"
                        className="w-full h-full object-cover"
                    />

                    {/* Gradient Overlay */}
                    <div className="absolute bottom-0 left-0 right-0 h-full bg-gradient-to-t from-white/90 via-white/40 to-white/0 pointer-events-none"></div>

                    <h2
                        className="absolute bottom-0 left-1/2 transform -translate-x-1/2 font-bold md:tracking-[5vw] tracking-[3vw] md:tracking-[35px] text-[clamp(100px,20vw,300px)]"
                        style={{
                            color: "white",
                            WebkitTextStroke: "3px #1e3a8a",
                        }}
                    >
                        Paul
                    </h2>
                </div>
            </div>
        </div>
    )
}

export default BannerLand
