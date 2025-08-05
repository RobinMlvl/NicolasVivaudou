import Image from 'next/image';

export default function Services() {
    return (
        <section id="services-section" className="py-16 px-6 bg-gray-50">
            <div className="max-w-6xl mx-auto">
                {/* Title */}
                <h2 className="section-title text-center mb-16 text-black">
                    PRESTATIONS
                </h2>
                
                {/* Services Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Portrait Service */}
                    <div className="relative group cursor-pointer">
                        <div className="aspect-[3/4] rounded-lg overflow-hidden relative">
                            <Image
                                src="/prestations/PORTRAIT.jpg"
                                alt="Portrait Photography"
                                fill
                                className="object-cover"
                            />
                        </div>
                        <div className="absolute bottom-6 left-0 right-0 text-center">
                            <h3 className="text-white text-4xl font-light">Portrait</h3>
                        </div>
                    </div>
                    
                    {/* Drone Service */}
                    <div className="relative group cursor-pointer">
                        <div className="aspect-[3/4] rounded-lg overflow-hidden relative">
                            <Image
                                src="/prestations/DRONE.jpg"
                                alt="Drone Photography"
                                fill
                                className="object-cover"
                            />
                        </div>
                        <div className="absolute bottom-6 left-0 right-0 text-center">
                            <h3 className="text-white text-4xl font-light">Drone</h3>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}