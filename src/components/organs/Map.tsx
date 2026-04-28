



const Map = () => {
    return (
      <section className="w-full flex flex-col items-center py-10">
        <h1 className="text-3xl font-bold mb-6">Nuestra Ubicación</h1>
            <div className="w-full max-w-4xl h-[450px]">
                <iframe
                  title="Bodycenter gym - Ubicación"
                  src="https://www.google.com/maps?q=-33.0094528,-71.5457609&z=16&output=embed"
                  width="100%"
                  height="450"
                  style={{ border: 0 }}
                  loading="lazy"
                  allowFullScreen
                />
            </div>
       </section>
        
    )
}

export default Map