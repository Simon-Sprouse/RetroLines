import React, { useState, useRef, useEffect } from 'react';
import { hsvToHex } from './colors';
import retroLines from './retroLines';
import presets from './presets.json';

function RetroCanvas2() { 


    /*
    ------------------------------------------
                    Parameters
    ------------------------------------------
    */

    const [presetNumber, setPresetNumber] = useState(0);
    const totalPresets = Object.keys(presets).length;

    const backgroundColorRef = useRef([42, 17, 100]);

    const canvasRef = useRef(null);



    const isRunningRefs = useState([]);
    const linesArrayRef = useRef([]);



    


    
    




    useEffect(() => { 


        const parameters = presets[presetNumber];

        linesArrayRef.current = [];
        isRunningRefs.current = [];

        for (let i = 0; i < 2; i++) { 

            const isRunningRef = {current: false};
            isRunningRefs.current.push(isRunningRef);

            const newLines = new retroLines(canvasRef, isRunningRef);
            newLines.setParameters(parameters.lineParams[0]);
            linesArrayRef.current.push(newLines);
        }

        

        backgroundColorRef.current = parameters.canvasParams.backgroundColor;
        


    }, []);

    useEffect(() => { 
        if (linesArrayRef.current.length > 0) {
            const parameters = presets[presetNumber];
            linesArrayRef.current.forEach(line => line.setParameters(parameters.lineParams[0]));
        }
    }, [presetNumber]);

    

    
    function resetBackground() { 
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        ctx.fillStyle = hsvToHex(...backgroundColorRef.current);
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    }



    async function runAnimationLoop() {


        linesArrayRef.current.forEach(lines => lines.startStopAnimation());




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

                runAnimationLoop();
            }
            else if (event.key == "2") { 
                setPresetNumber(number => (number + 1) % totalPresets);
                
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





/*
    "0": {
        "lineWidth": 30,
        "spacing": 100,
        "borderSize": 100,
        "radius": 30,
        "pad": 0,
        "arcAnimationSpeed": 60,
        "lineAnimationSpeed": 60,
        "colorSpeed": 0.0000,
        "backgroundColor": [0, 0, 0], 
        "borderColor": [0, 0, 0],
        "colors": [
            [358, 80, 69],
            [12, 75, 95],
            [26, 88, 98],
            [36, 88, 98],
            [40, 51, 100]
        ],
        "movementStyle": "random"
    },

    "1": {
        "lineWidth": 20,
        "spacing": 100,
        "borderSize": 100,
        "radius": 30,
        "pad": 0,
        "arcAnimationSpeed": 100,
        "lineAnimationSpeed": 100,
        "colorSpeed": 0.001,
        "backgroundColor": [0, 0, 0], 
        "borderColor": [0, 0, 0],
        "colors": [
            [0, 40, 100],
            [0, 40, 100]
        ],
        "movementStyle": "random"
    },

    "2": {
        "lineWidth": 30,
        "spacing": 100,
        "borderSize": 200,
        "radius": 30,
        "pad": 100,
        "arcAnimationSpeed": 30,
        "lineAnimationSpeed": 30,
        "colorSpeed": 0.002,
        "backgroundColor": [42, 17, 100], 
        "borderColor": [0, 0, 0],
        "colors": [
            [250, 40, 100],
            [250, 40, 100]
        ],
        "movementStyle": "random"
    },

    */