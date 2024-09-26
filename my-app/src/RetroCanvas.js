import React, { useRef, useEffect } from 'react';

function RetroCanvas() { 

    const canvasRef = useRef(null);


    function drawLine(a, b, lineWidth, spacing) {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');

        ctx.lineWidth = lineWidth;

        const colors = [
            '#AF2327', // Dark Red
            '#F25C3C', // Orange-Red
            '#F97C1E', // Orange
            '#F9A31E', // Light Orange
            '#FFD37C'  // Yellow
        ];

        colors.forEach((color, index) => { 
            ctx.beginPath();
            ctx.strokeStyle = color;

            const y = a.x + index * (spacing / (colors.length - 1));


            ctx.moveTo(a.x, y);
            ctx.lineTo(b.x, y);


            ctx.stroke();
        })

    }

    useEffect(() => {
        
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        ctx.fillStyle = "black";
        ctx.fillRect(0, 0, canvas.width, canvas.height);


        

    }, []);

    function test() { 
        const pointA = { x:100, y:100};
        const pointB = { x:700, y:100};
        drawLine(pointA, pointB, 10, 100);
    }

    return (
        <>
            <canvas ref={canvasRef} height='800' width='1200'></canvas>
            <button onClick={test}>Test</button>
        </>
    )
}

export default RetroCanvas;