import React, { useState, useRef, useEffect } from 'react';

function RetroCanvas() { 

    const canvasRef = useRef(null);

    const aPos = useRef({ x:100, y:100 });
    const aDir = useRef("right");
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


        if (direction == "right") { 
            colors.forEach((color, index) => { 
                ctx.beginPath();
                ctx.strokeStyle = color;

                const y = a.y + index * (spacing / (colors.length - 1));
    
                ctx.moveTo(a.x, y);
                ctx.lineTo(b.x, y);
    
                ctx.stroke();
            });
            aPos.current = {x: b.x, y: a.y};
            aDir.current = "right"
        }
        else if (direction == "left") { 
            colors.forEach((color, index) => { 
                ctx.beginPath();
                ctx.strokeStyle = color;

                const y = a.y - index * (spacing / (colors.length - 1));

                ctx.moveTo(a.x, y);
                ctx.lineTo(b.x, y);

                ctx.stroke();
            });
            aPos.current = {x:b.x , y: a.y};
            aDir.current = "left"
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
            aDir.current = "up";
        }
        else if (direction == "down") { 
            

            colors.forEach((color, index) => { 
                ctx.beginPath();
                ctx.strokeStyle = color;

                const x = a.x - index * (spacing / (colors.length - 1));

                ctx.moveTo(x, a.y);
                ctx.lineTo(x, b.y);

                ctx.stroke();
            });

            aPos.current = {x:a.x , y: b.y};
            aDir.current = "down";
        }


        
        

    };


    function drawArc(a, radius, lineWidth, spacing, direction="r2d") { 

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

        if (direction == "r2d") { 
            colors.forEach((color, index) => { 
                ctx.beginPath();
                ctx.strokeStyle = color;
    
                const startX = a.x;
                const startY = a.y + index * (spacing / (colors.length - 1));
    
                const endX = a.x + radius + (colors.length - 1 - index) * (spacing / (colors.length - 1));
                const endY = a.y + radius + spacing;
    
                ctx.moveTo(startX, startY);
    
                ctx.arcTo(endX, startY, endX, endY, Math.abs(startY - endY));
    
                ctx.stroke();
            });
            aPos.current = {x: a.x + spacing + radius, y: a.y + spacing + radius};
            aDir.current = "down";
        }

        else if (direction == "d2l") {
            colors.forEach((color, index) => { 
                ctx.beginPath();
                ctx.strokeStyle = color;
    
                const startX = a.x - index * (spacing / (colors.length - 1));
                const startY = a.y;
    
                const endX = a.x - radius - spacing;
                const endY = a.y + radius + (colors.length - 1 - index) * (spacing / (colors.length - 1));
    
                ctx.moveTo(startX, startY);
    
                ctx.arcTo(startX, endY, endX, endY, Math.abs(startY - endY));
    
                ctx.stroke();
            });
            aPos.current = {x: a.x - spacing - radius, y: a.y + spacing + radius};
            aDir.current = "left";
        }
        else if (direction == "l2u") { 

        }
        else if (direction == "u2r") { 

        }


        else if (direction == "u2l"){ 

        }
        else if (direction == "l2d") { 

        }
        else if (direction == "d2r") { 

        }
        else if (direction == "r2u") { 

        }


        


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
        
        drawLine(aPos.current, pointB, 20, 100, "right");
        drawArc(aPos.current, 30, 20, 100, "r2d");
        drawLine(aPos.current, pointD, 20, 100, "down");

        drawArc(aPos.current, 30, 20, 100, "d2l")

        // drawLine(aPos.current, pointB, 20, 100, "right");
        // drawLine(aPos.current, pointD, 20, 100, "down");
        // drawLine(aPos.current, pointC, 20, 100, "left");
        // drawLine(aPos.current, pointA, 20, 100, "up");
        
        
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