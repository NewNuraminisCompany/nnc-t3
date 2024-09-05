import React from "react";
import Image from "next/image";

const Header = () => {
  return (
    <div className="w-full">
      <Image
        src="https://utfs.io/f/f96b4688-b46e-4c39-bc96-3c463af62aae-1ta2k.jpg"
        layout="fill"
        objectFit="cover"
        alt="{event.nome}"
        className="z-1 max-h-[36rem] rounded-sm"
      />
      <h1 className="text-8xl font-bold">Eventoi</h1>
    </div>
  );
};

export default Header;
