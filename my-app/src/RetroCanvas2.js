import React, { useState, useRef, useEffect } from 'react';
import hsvToHex from './colors';
import retroLines from './retroLines';

function RetroCanvas2() { 


    /*
    ------------------------------------------
                    Parameters
    ------------------------------------------
    */

    const backgroundColor = [0, 0, 0];

    const canvasRef = useRef(null);
    const isRunningRef = useRef(false);

    const parameters = {
        lineWidth: 20,
        spacing: 70,
        radius: 30,
        pad: 0,
        arcAnimationSpeed: 60,
        lineAnimationSpeed: 60,
        colorSpeed: 0.0002,
        backgroundColor: [0, 0, 0], 
        borderColor: [0, 0, 0],
        colors: [
            [358, 80, 69],
            [12, 75, 95],
            [26, 88, 98],
            [36, 88, 98],
            [40, 51, 100],
        ],
    }


    const linesRef = useRef(null);



    


    
    




    useEffect(() => { 
        linesRef.current = new retroLines(canvasRef, isRunningRef);
        linesRef.current.setParameters(parameters);
    }, []);

    

    
    function resetBackground() { 
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        ctx.fillStyle = hsvToHex(...backgroundColor);
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    }


    /*
    ------------------------------------------
                        UX
    ------------------------------------------
    */

    useEffect(() => {
        
        const canvas = canvasRef.current;

        function handleResize() {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        }
        
        handleResize();


        window.addEventListener("resize", handleResize);
        
        return () => {
            window.removeEventListener("resize", handleResize);
        }

    }, []);


    useEffect(() => { 

        function handleKeyDown(event) {

            if (event.key === "t") { 
                test();
            }
            else if (event.key === " ") { 
                resetBackground();
            }
            else if (event.key === "r") { 
                window.location.reload();
            }
            else if (event.key == "Enter") { 
                linesRef.current.startStopAnimation();
            }
        }


        document.addEventListener("keydown", handleKeyDown);

        return () => { 
            document.removeEventListener("keydown", handleKeyDown);
        }
    })



    async function test() { 






       
    }

    

    

    return (
        <>
            <canvas ref={canvasRef} height='1000' width='2000'></canvas>

        </>
    )
}

export default RetroCanvas2;



    // const backgroundColor = "#512B0A"
    // const [colors, setColors] = useState([
    //     '#AF2327', // Dark Red
    //     '#F25C3C', // Orange-Red
    //     '#F97C1E', // Orange
    //     '#F9A31E', // Light Orange
    //     '#FFD37C'  // Yellow
    // ]);

    // const backgroundColor = "#440044"
    // const [colors, setColors] = useState([
    //     '#2C3E50', // Deep Charcoal
    //     '#4E6E58', // Olive Green
    //     '#C2C287', // Sand
    //     '#E2D4B7', // Light Beige
    //     '#F7F7E8'  // Off White
    // ]);

    // const backgroundColor = "#1B263B";  // Dark Navy Blue
    // const colors = useRef([
    //     '#0F4C81', // Deep Blue
    //     '#217CA3', // Sky Blue
    //     '#33A8B0', // Teal
    //     '#A1C3D1', // Light Blue
    //     '#F3D6E4'  // Soft Pink
    // ]);

    // const backgroundColor = "#1B263B";  // Dark Navy Blue
    // const colors = useRef([
    //     [358, 80, 69],
    //     [12, 75, 95],
    //     [26, 88, 98],
    //     [36, 88, 98],
    //     [40, 51, 100],
    // ]);