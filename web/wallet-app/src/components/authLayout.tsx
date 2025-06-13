import React, { type ReactNode, useEffect, useState } from "react";
import revenue1 from "../assets/images/revenue-i2.png";
import revenue2 from "../assets/images/revenue-i3.png";
import revenue3 from "../assets/images/revenue-i4.png";

interface Props {
    children: ReactNode;
}

const imageList = [revenue1, revenue2, revenue3];

const AuthLayout: React.FC<Props> = ({ children }) => {
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentImageIndex((prevIndex) => (prevIndex + 1) % imageList.length);
        }, 10000);

        return () => clearInterval(interval);
    }, []);

    return (
        <div className="min-h-screen flex">
            <div className="w-1/2 relative">
                <img
                    src={imageList[currentImageIndex]}
                    alt="Auth slide"
                    className="w-full h-full object-fit transition-opacity duration-1000 absolute inset-0"
                />
            </div>

            <div className="w-1/2 flex items-center justify-center p-8 rounded-xl shadow-xl ">
                {children}
            </div>
        </div>
    );
};

export default AuthLayout;
