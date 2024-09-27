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
            colors.forEach((color, index) => { 
                ctx.beginPath();
                ctx.strokeStyle = color;
    
                const startX = a.x;
                const startY = a.y - index * (spacing / (colors.length - 1));
    
                const endX = a.x - radius - (colors.length - 1 - index) * (spacing / (colors.length - 1));
                const endY = a.y - radius - spacing;
    
                ctx.moveTo(startX, startY);
    
                ctx.arcTo(endX, startY, endX, endY, Math.abs(startY - endY));
    
                ctx.stroke();
            });
            aPos.current = {x: a.x - spacing - radius, y: a.y - spacing - radius};
            aDir.current = "up";
        }
        else if (direction == "u2r") { 
            colors.forEach((color, index) => { 
                ctx.beginPath();
                ctx.strokeStyle = color;
    
                const startX = a.x + index * (spacing / (colors.length - 1));
                const startY = a.y;
    
                const endX = a.x + radius + spacing;
                const endY = a.y - radius - (colors.length - 1 - index) * (spacing / (colors.length - 1));
    
                ctx.moveTo(startX, startY);
    
                ctx.arcTo(startX, endY, endX, endY, Math.abs(startY - endY));
    
                ctx.stroke();
            });
            aPos.current = {x: a.x + spacing + radius, y: a.y - spacing - radius};
            aDir.current = "right";
        }


        else if (direction == "u2l"){ 
            colors.forEach((color, index) => { 
                ctx.beginPath();
                ctx.strokeStyle = color;
    
                const startX = a.x + index * (spacing / (colors.length - 1));
                const startY = a.y;
    
                const endX = a.x - radius;
                const endY = a.y - radius - index * (spacing / (colors.length - 1));
    
                ctx.moveTo(startX, startY);
    
                ctx.arcTo(startX, endY, endX, endY, Math.abs(startY - endY));
    
                ctx.stroke();
            });
            aPos.current = {x: a.x - radius, y: a.y - radius};
            aDir.current = "left";
        }
        else if (direction == "l2d") { 
            colors.forEach((color, index) => { 
                ctx.beginPath();
                ctx.strokeStyle = color;
    
                const startX = a.x;
                const startY = a.y - index * (spacing / (colors.length - 1));
    
                const endX = a.x - radius - index * (spacing / (colors.length - 1));
                const endY = a.y + radius;
    
                ctx.moveTo(startX, startY);
    
                ctx.arcTo(endX, startY, endX, endY, Math.abs(startY - endY));
    
                ctx.stroke();
            });
            aPos.current = {x: a.x - radius, y: a.y + radius};
            aDir.current = "down";
        }
        else if (direction == "d2r") { 

            colors.forEach((color, index) => { 
                ctx.beginPath();
                ctx.strokeStyle = color;
    
                const startX = a.x - index * (spacing / (colors.length - 1));
                const startY = a.y;
    
                const endX = a.x + radius;
                const endY = a.y + radius + index * (spacing / (colors.length - 1));
    
                ctx.moveTo(startX, startY);
    
                ctx.arcTo(startX, endY, endX, endY, Math.abs(startY - endY));
    
                ctx.stroke();
            });
            aPos.current = {x: a.x + radius, y: a.y + radius};
            aDir.current = "right";

        }
        else if (direction == "r2u") { 
            colors.forEach((color, index) => { 
                ctx.beginPath();
                ctx.strokeStyle = color;
    
                const startX = a.x;
                const startY = a.y + index * (spacing / (colors.length - 1));
    
                const endX = a.x + radius + index * (spacing / (colors.length - 1));
                const endY = a.y - radius;
    
                ctx.moveTo(startX, startY);
    
                ctx.arcTo(endX, startY, endX, endY, Math.abs(startY - endY));
    
                ctx.stroke();
            });
            aPos.current = {x: a.x + radius, y: a.y - radius};
            aDir.current = "up";
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
        const pointB = { x:1000, y:100 };
        const pointC = { x:500, y:600 };
        const pointD = { x:1000, y:600 };
        const pointE = { x:500, y:600 };
        const pointF = { x:800, y:600 };
        const pointG = { x:800, y:400 };
        const pointH = { x:150, y:400 };
        const pointI = { x:150, y:650 };
        const pointJ = { x:200, y:650 };
        const pointK = { x:200, y:450 };
        
        drawLine(aPos.current, pointB, 20, 100, "right");
        drawArc(aPos.current, 30, 20, 100, "r2d");
        drawLine(aPos.current, pointD, 20, 100, "down");

        drawArc(aPos.current, 30, 20, 100, "d2l")
        drawLine(aPos.current, pointC, 20, 100, "left");

        drawArc(aPos.current, 30, 20, 100, "l2u");
        drawLine(aPos.current, pointE, 20, 100, "up");

        drawArc(aPos.current, 30, 20, 100, "u2r");
        drawLine(aPos.current, pointF, 20, 100, "right");

        drawArc(aPos.current, 30, 20, 100, "r2u");
        drawLine(aPos.current, pointG, 20, 100, "up");

        drawArc(aPos.current, 30, 20, 100, "u2l");
        drawLine(aPos.current, pointH, 20, 100, "left");

        drawArc(aPos.current, 30, 20, 100, "l2d");
        drawLine(aPos.current, pointI, 20, 100, "down");

        drawArc(aPos.current, 30, 20, 100, "d2r");
        drawLine(aPos.current, pointJ, 20, 100, "right");

        drawArc(aPos.current, 30, 20, 100, "r2u");
        drawLine(aPos.current, pointK, 20, 100, "up");

        // drawArc(aPos.current, 20, 20, 100, "u2l");
        // drawLine(aPos.current, pointG, 20, 100, "")

        // drawLine(aPos.current, )

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