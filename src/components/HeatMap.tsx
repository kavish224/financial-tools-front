const Heatmap = () => {
  return (
    <div className="w-full h-[400px] sm:h-[460px] overflow-hidden border border-gray-300 rounded-lg relative">
      <iframe
        src="https://heatmap.kavishambani.in/"
        className="absolute top-0 left-0 w-full h-full transform"
        style={{
          transform: 'scale(1)', // Adjust scale as needed for responsiveness
          transformOrigin: 'top left',
          border: 'none',
          minWidth: '300px', // Set minimum width for smaller screens
          maxWidth: '100%',
          height: '100%',
        }}
        // scrolling="no"
      />
    </div>
  );
};

export default Heatmap;
