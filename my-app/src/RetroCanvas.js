import React, { useState, useRef, useEffect } from 'react';

function RetroCanvas() { 

    const canvasRef = useRef(null);

    const aPos = useRef({ x:1000, y:0 });
    const aDir = useRef("right");


    const [colors, setColors] = useState([
        '#AF2327', // Dark Red
        '#F25C3C', // Orange-Red
        '#F97C1E', // Orange
        '#F9A31E', // Light Orange
        '#FFD37C'  // Yellow
    ]);


    





    function drawLine(a, b, lineWidth, spacing, direction="left") {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');

        ctx.lineWidth = lineWidth;


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
        ctx.fillStyle = "lightgrey";
        ctx.fillRect(0, 0, canvas.width, canvas.height);


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

    function test() { 

        const radius = 30;
        const lineWidth = 20;
        const spacing = 100;


        
        for (let i = 0; i < 40; i ++){

            let path = Math.round(Math.random());

            if (aDir.current == "down") { 

                if (path == 0) { 
                    drawArc(aPos.current, radius, lineWidth, spacing, "d2l");
                    const newX = Math.round(Math.random() * aPos.current.x);
                    const newY = aPos.current.y;
                    const newPoint = {x:newX, y:newY};
                    drawLine(aPos.current, newPoint, lineWidth, spacing, "left");
                }
                else { 
                    drawArc(aPos.current, radius, lineWidth, spacing, "d2r");
                    const newX = aPos.current.x + Math.round(Math.random() * (canvasRef.current.width - aPos.current.x));
                    const newY = aPos.current.y;
                    const newPoint = {x:newX, y:newY};
                    drawLine(aPos.current, newPoint, lineWidth, spacing, "right");
                }
            }
            else if (aDir.current == "left") { 


                if (path == 0) { 
                    drawArc(aPos.current, radius, lineWidth, spacing, "l2u");
                    const newX = aPos.current.x
                    const newY = Math.round(Math.random() * aPos.current.y);
                    const newPoint = {x:newX, y:newY};
                    drawLine(aPos.current, newPoint, lineWidth, spacing, "up");
                }
                else { 
                    drawArc(aPos.current, radius, lineWidth, spacing, "l2d");
                    const newX = aPos.current.x;
                    const newY = aPos.current.y + Math.round(Math.random() * (canvasRef.current.height - aPos.current.y));
                    const newPoint = {x:newX, y:newY};
                    drawLine(aPos.current, newPoint, lineWidth, spacing, "down");
                }

            }
            else if (aDir.current == "up") { 
                if (path == 0) { 
                    drawArc(aPos.current, radius, lineWidth, spacing, "u2l");
                    const newX = Math.round(Math.random() * aPos.current.x);
                    const newY = aPos.current.y;
                    const newPoint = {x:newX, y:newY};
                    drawLine(aPos.current, newPoint, lineWidth, spacing, "left");
                }
                else { 
                    drawArc(aPos.current, radius, lineWidth, spacing, "u2r");
                    const newX = aPos.current.x + Math.round(Math.random() * (canvasRef.current.width - aPos.current.x));
                    const newY = aPos.current.y;
                    const newPoint = {x:newX, y:newY};
                    drawLine(aPos.current, newPoint, lineWidth, spacing, "right");
                }
            }
            else if (aDir.current == "right") { 
                if (path == 0) { 
                    drawArc(aPos.current, radius, lineWidth, spacing, "r2u");
                    const newX = aPos.current.x
                    const newY = Math.round(Math.random() * aPos.current.y);
                    const newPoint = {x:newX, y:newY};
                    drawLine(aPos.current, newPoint, lineWidth, spacing, "up");
                }
                else { 
                    drawArc(aPos.current, radius, lineWidth, spacing, "r2d");
                    const newX = aPos.current.x;
                    const newY = aPos.current.y + Math.round(Math.random() * (canvasRef.current.height - aPos.current.y));
                    const newPoint = {x:newX, y:newY};
                    drawLine(aPos.current, newPoint, lineWidth, spacing, "down");
                }
            }
        }

        // drawArc(aPos.current, 20, 20, 100, "u2l");
        // drawLine(aPos.current, pointG, 20, 100, "")

        // drawLine(aPos.current, )

        // drawLine(aPos.current, pointB, 20, 100, "right");
        // drawLine(aPos.current, pointD, 20, 100, "down");
        // drawLine(aPos.current, pointC, 20, 100, "left");
        // drawLine(aPos.current, pointA, 20, 100, "up");

        if (aDir.current == "down") { 
            const finalPoint = {x: aPos.current.x, y: canvasRef.current.height};
            drawLine(aPos.current, finalPoint, lineWidth, spacing, "down");
        }
        else if (aDir.current == "up") { 
            const finalPoint = {x: aPos.current.x, y: 0};
            drawLine(aPos.current, finalPoint, lineWidth, spacing, "up");
        }
        else if (aDir.current == "left") { 
            const finalPoint = {x: 0, y: aPos.current.y};
            drawLine(aPos.current, finalPoint, lineWidth, spacing, "left");
        }
        else if (aDir.current == "right") { 
            const finalPoint = {x: canvasRef.current.width, y: aPos.current.y};
            drawLine(aPos.current, finalPoint, lineWidth, spacing, "right");
        }
        

        
        
    }




    useEffect(() => { 

        function handleKeyDown(event) {
            console.log('anything');


            if (event.key == "Enter") { 
                test();
            }
            else if (event.key == " ") { 
                const canvas = canvasRef.current;
                const ctx = canvas.getContext('2d');
                ctx.fillStyle = "#572800";
                ctx.fillRect(0, 0, canvas.width, canvas.height);
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
            {/* <button onClick={test}>Test</button> */}
        </>
    )
}

export default RetroCanvas;






/*

List of potential mods: 

have the turns be square instead of circular



*/