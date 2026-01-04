const Santa = ({ onSantaClick, slide }) => {
  return (
    <div className={`fixed z-50 cursor-pointer transition-all duration-1200 ease-in-out ${
        slide === 1
          ? 'bottom-8 left-8 w-80 md:w-96 -rotate-6 scale-120'
          : 'bottom-20 right-8 w-80 md:w-96 translate-x-1/2 -rotate-12'
      }`} onClick={onSantaClick}>
      <div className="relative">
        <img src="/santa.png" alt="Санта Клаус" className="w-full scale-100 drop-shadow-2xl hover:scale-110 transition-transform filter hover:brightness-110"/>
      </div>
    </div>
  );
};

export default Santa;