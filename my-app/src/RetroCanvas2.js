import React, { useState, useRef, useEffect } from 'react';

function RetroCanvas2() { 


    const lineWidth = 20;
    const spacing = 100;



    const canvasRef = useRef(null);

    const aRef = useRef({ x:400, y:200 });

    const bRef = useRef({ 
        x: 400 + Math.round(Math.cos(Math.PI * 4 / 6) * spacing),
        y: 200 + Math.round(Math.sin(Math.PI * 4 / 6) * spacing),
    });





    const [colors, setColors] = useState([
        '#AF2327', // Dark Red
        '#F25C3C', // Orange-Red
        '#F97C1E', // Orange
        '#F9A31E', // Light Orange
        '#FFD37C'  // Yellow
    ]);


    function drawCircle(x, y, radius, color) { 
        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");

        ctx.beginPath();
        ctx.arc(x, y, radius, 0, Math.PI * 2);
        ctx.fillStyle = color;
        ctx.fill();
        ctx.closePath();
    }
    
    function resetBackground() { 
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        ctx.fillStyle = "#572800";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    }

    function distance(a, b) { 
        return Math.sqrt((b.x - a.x)**2 + (b.y - a.y)**2);
    }


    function drawLine(length, updatePoints=true) {

        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');

        ctx.lineWidth = lineWidth;

        const a = aRef.current;
        const b = bRef.current;


        const lengthAB = distance(a, b);

        const ab = {
            x: spacing * (b.x - a.x) / lengthAB,
            y: spacing * (b.y - a.y) / lengthAB,
        };

        const d = {
            x: length * (b.y - a.y) / lengthAB,
            y: length * (a.x - b.x) / lengthAB,
        };

        // silly trick to prevent border drawing (thanks web browser!! (ಠ_ಠ))
        const d2 = {
            x: (length + 1) * (b.y - a.y) / lengthAB,
            y: (length + 1) * (a.x - b.x) / lengthAB,
        };

        colors.forEach((color, index) => { 
            
            const startX = a.x + (index / (colors.length - 1)) * ab.x;
            const startY = a.y + (index / (colors.length - 1)) * ab.y;

            const endX = a.x + d2.x + (index / (colors.length - 1)) * ab.x;
            const endY = a.y + d2.y + (index / (colors.length - 1)) * ab.y;

            ctx.beginPath();
            ctx.strokeStyle = color;
            ctx.moveTo(startX, startY);
            ctx.lineTo(endX, endY);
            ctx.stroke();

        })

        // true when animation is over
        if (updatePoints == true) { 
            aRef.current = {
                x: a.x + d.x,
                y: a.y + d.y,
            };
    
            bRef.current = {
                x: a.x + d.x + ab.x,
                y: a.y + d.y + ab.y,
            };
        }

 

    };

    function findPointAfterRotation(centerX, centerY, outerX, outerY, rotation) { 
        const xRelative = outerX - centerX;
        const yRelative = outerY - centerY;

        const xNew = xRelative * Math.cos(rotation) - yRelative * Math.sin(rotation);
        const yNew = xRelative * Math.sin(rotation) + yRelative * Math.cos(rotation);

        const newPoint = {
            x: centerX + xNew,
            y: centerY + yNew,
        };

        return newPoint;
    }


    function drawArc(rotation, radius) { 

        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");

        ctx.lineWidth = lineWidth;

        const a = aRef.current;
        const b = bRef.current;

        const startingAngle = Math.atan2(b.y - a.y, b.x - a.x);

        console.log("Starting angle: ", startingAngle * (360 / Math.PI));

        


        


        if (rotation >= 0) { 

            const h = radius + spacing;
            const centerX = a.x + h * Math.cos(Math.PI * 2 - startingAngle);
            const centerY = a.y - h * Math.sin(Math.PI * 2 - startingAngle);

            colors.forEach((color, index) => { 

                const r = radius + (colors.length - index - 1) / (colors.length - 1) * spacing
    
                ctx.beginPath();
                ctx.strokeStyle = color;
                // ctx.moveTo(a.x, a.y);
                ctx.arc(centerX, centerY, r, startingAngle + Math.PI, startingAngle + Math.PI + rotation, false);
                ctx.stroke();
            })

            aRef.current = findPointAfterRotation(centerX, centerY, a.x, a.y, rotation);
            bRef.current = findPointAfterRotation(centerX, centerY, b.x, b.y, rotation);

        }
        else if (rotation < 0) { 

            const h = radius;
            const centerX = a.x - h * Math.cos(Math.PI * 2 - startingAngle);
            const centerY = a.y + h * Math.sin(Math.PI * 2 - startingAngle);

            colors.forEach((color, index) => { 
                
                const r = radius + (index / (colors.length - 1)) * spacing;

                ctx.beginPath();
                ctx.strokeStyle = color;
                // ctx.moveTo(a.x, a.y);
                ctx.arc(centerX, centerY, r, startingAngle, startingAngle + rotation, true);
                ctx.stroke();
            })

            aRef.current = findPointAfterRotation(centerX, centerY, a.x, a.y, rotation);
            bRef.current = findPointAfterRotation(centerX, centerY, b.x, b.y, rotation);

        }

        
        


    }












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


    function runAnimateLine(length) { 
        let animationLength = 0;

        return new Promise((resolve) => { 
            function animateLine() { 
                if (animationLength < length) { 
                    animationLength += 40;
                    drawLine(animationLength, false);
                    requestAnimationFrame(animateLine);
                }
                else { 
                    drawLine(length, true);
                    resolve();
                }
            }
            animateLine();
        })
        
    }

    async function test() { 

        let a = aRef.current;
        let b = bRef.current;

        drawCircle(a.x, a.y, 10, "red");
        drawCircle(b.x, b.y, 10, "blue");

        drawLine(1000);

        a = aRef.current;
        b = bRef.current;

        drawCircle(a.x, a.y, 10, "red");
        drawCircle(b.x, b.y, 10, "blue");


        drawArc(Math.PI * -3 / 2, 30);

        a = aRef.current;
        b = bRef.current;

        drawCircle(a.x, a.y, 10, "red");
        drawCircle(b.x, b.y, 10, "blue");



        

        // for (let i = 0; i < 10; i++) { 
        //     await runAnimateLine(100);
        // }

       
    }




    useEffect(() => { 

        function handleKeyDown(event) {

            if (event.key === "Enter") { 
                test();
            }
            else if (event.key === " ") { 
                resetBackground();
            }
            else if (event.key === "r") { 
                window.location.reload();
            }
        }


        document.addEventListener("keydown", handleKeyDown);

        return () => { 
            document.removeEventListener("keydown", handleKeyDown);
        }
    })

    

    return (
        <>
            <canvas ref={canvasRef} height='1000' width='2000'></canvas>

        </>
    )
}

export default RetroCanvas2;



