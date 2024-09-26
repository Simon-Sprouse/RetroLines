import React, { useState, useRef, useEffect } from 'react';

function RetroCanvas() { 

    const canvasRef = useRef(null);

    const aPos = useRef({ x:100, y:100 });

    // const [direction, setDirection] = useState("Right");


    function drawLine(a, b, lineWidth, spacing, direction="left") {
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


        if (direction == "left") { 
            colors.forEach((color, index) => { 
                ctx.beginPath();
                ctx.strokeStyle = color;

                const y = a.y + index * (spacing / (colors.length - 1));
    
                ctx.moveTo(a.x, y);
                ctx.lineTo(b.x, y);
    
                ctx.stroke();
            });
            aPos.current = {x: b.x, y: a.y};
        }
        else if (direction == "right") { 
            colors.forEach((color, index) => { 
                ctx.beginPath();
                ctx.strokeStyle = color;

                const y = a.y - index * (spacing / (colors.length - 1));

                ctx.moveTo(a.x, y);
                ctx.lineTo(b.x, y);

                ctx.stroke();
            });
            aPos.current = {x:b.x , y: a.y};
        }
        else if (direction == "up") { 

            colors.forEach((color, index) => { 
                ctx.beginPath();
                ctx.strokeStyle = color;

                const x = a.x + index * (spacing / (colors.length - 1));

                ctx.moveTo(x, a.y);
                ctx.lineTo(x, b.y);

                ctx.stroke();
            });


            aPos.current = {x:a.x , y: b.y};
        }
        else if (direction == "down") { 
            aPos.current = {x:a.x , y: b.y};

            colors.forEach((color, index) => { 
                ctx.beginPath();
                ctx.strokeStyle = color;

                const x = a.x - index * (spacing / (colors.length - 1));

                ctx.moveTo(x, a.y);
                ctx.lineTo(x, b.y);

                ctx.stroke();
            });
        }


        

        

    };


    function drawArc(a, radius, lineWidth, spacing) { 

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

            const startX = a.x;
            const startY = a.y + index * (spacing / (colors.length - 1));

            const endX = a.x + radius + (colors.length - 1 - index) * (spacing / (colors.length - 1));
            const endY = a.y + radius + spacing;

            ctx.moveTo(startX, startY);
            // ctx.lineTo(endX, endY);


            ctx.arcTo(endX, startY, endX, endY, Math.abs(startY - endY));


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
        const pointA = { x:100, y:100 };
        const pointB = { x:700, y:100 };
        const pointC = { x:100, y:400 };
        const pointD = { x:700, y:400 };
        drawLine(pointA, pointB, 10, 100);
        // drawLine(pointB, pointC, 10, 100);
        // drawArc(pointB, 30, 10, 100);


        drawLine(pointC, pointD, 10, 100, "right");
        drawLine(pointA, pointC, 10, 100, "up");
        drawLine(pointD, pointB, 10, 100, "down");
        
    }

    return (
        <>
            <canvas ref={canvasRef} height='800' width='1200'></canvas>
            <button onClick={test}>Test</button>
        </>
    )
}

export default RetroCanvas;






/*

List of potential mods: 

have the turns be square instead of circular



*/