import React, { useState, useRef, useEffect } from 'react';

function RetroCanvas2() { 


    /*
    ------------------------------------------
                    Parameters
    ------------------------------------------
    */

    const lineWidth = 20;
    const spacing = 100;
    const radius = 30;
    const arcAnimationSpeed = 40;
    const lineAnimationSpeed = 40;
    const pad = 300;

    // const [colors, setColors] = useState([
    //     '#AF2327', // Dark Red
    //     '#F25C3C', // Orange-Red
    //     '#F97C1E', // Orange
    //     '#F9A31E', // Light Orange
    //     '#FFD37C'  // Yellow
    // ]);

    const [colors, setColors] = useState([
        '#2C3E50', // Deep Charcoal
        '#4E6E58', // Olive Green
        '#C2C287', // Sand
        '#E2D4B7', // Light Beige
        '#F7F7E8'  // Off White
    ]);
    
    

    const borderColor = "#000000";
    const borderSize = lineWidth + spacing - 10;


    const canvasRef = useRef(null);
    const a1Ref = useRef({ x:1000, y:600 });
    const b1Ref = useRef({ 
        x: 1000 + Math.round(Math.cos(Math.PI * 4 / 4) * spacing),
        y: 600 + Math.round(Math.sin(Math.PI * 4 / 4) * spacing),
    });





    const run = useRef(false);




    /*
    ------------------------------------------
                    Draw Line
    ------------------------------------------
    */


    function distance(a, b) { 
        return Math.sqrt((b.x - a.x)**2 + (b.y - a.y)**2);
    }

    // to calculate where points land without drawing them
    function movePointsLine(a, b, length) { 


        const lengthAB = distance(a, b);

        const ab = {
            x: spacing * (b.x - a.x) / lengthAB,
            y: spacing * (b.y - a.y) / lengthAB,
        };

        const d = {
            x: length * (b.y - a.y) / lengthAB,
            y: length * (a.x - b.x) / lengthAB,
        };


        const newPoint =  {
            aEnd: {
                x: a.x + d.x,
                y: a.y + d.y,
            },
            bEnd: {
                x: a.x + d.x + ab.x,
                y: a.y + d.y + ab.y,
            }
            
        }

        return newPoint;

 
    
    }


    function drawLine(aRef, bRef, length, updatePoints=true) {

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

        // unit vector in direction of movement - (to move colors back a bit)
        const dNorm = {
            x: (b.y - a.y) / lengthAB,
            y: (a.x - b.x) / lengthAB,
        }

        // silly trick to prevent border drawing (thanks web browser!! (ಠ_ಠ))
        const d2 = {
            x: (length + 1) * (b.y - a.y) / lengthAB,
            y: (length + 1) * (a.x - b.x) / lengthAB,
        };



        // draw border
        const startXBorder = a.x + 0.5 * ab.x;
        const startYBorder = a.y + 0.5 * ab.y;

        const endXBorder = a.x + d2.x + 0.5 * ab.x;
        const endYBorder = a.y + d2.y + 0.5 * ab.y;

        ctx.beginPath();
        ctx.strokeStyle = borderColor;
        ctx.lineWidth = borderSize;
        ctx.moveTo(startXBorder, startYBorder);
        ctx.lineTo(endXBorder, endYBorder);
        ctx.stroke();


        ctx.lineWidth = lineWidth;


        colors.forEach((color, index) => { 
            
            const startX = a.x + (index / (colors.length - 1)) * ab.x - dNorm.x;
            const startY = a.y + (index / (colors.length - 1)) * ab.y - dNorm.y;

            const endX = a.x + d2.x + (index / (colors.length - 1)) * ab.x;
            const endY = a.y + d2.y + (index / (colors.length - 1)) * ab.y;


            

            ctx.beginPath();
            ctx.strokeStyle = color;

            ctx.moveTo(startX, startY);
            ctx.lineTo(endX, endY);
            ctx.stroke();

            

        })

        // true when animation is over
        if (updatePoints === true) { 
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

    function runLine(length) { 
        let animationLength = 0;

        return new Promise((resolve) => { 
            function animateLine() { 
                if (animationLength + lineAnimationSpeed < length) { 
                    animationLength += lineAnimationSpeed;
                    drawLine(a1Ref, b1Ref, animationLength, false);
                    requestAnimationFrame(animateLine);
                }
                else { 
                    drawLine(a1Ref, b1Ref, length, false);
                    drawLine(a1Ref, b1Ref, length, false);
                    drawLine(a1Ref, b1Ref, length, true)
                    resolve();
                }
            }
            animateLine();
        })
        
    }



    /*
    ------------------------------------------
                    Draw Arc  
    ------------------------------------------
    */


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


    // function to move points in an arc without drawing them
    function movePointsArc(a, b, rotation) {

        const startingAngle = Math.atan2(b.y - a.y, b.x - a.x);

        if (rotation >= 0) { 
            const h = radius + spacing;
            const centerX = a.x + h * Math.cos(Math.PI * 2 - startingAngle);
            const centerY = a.y - h * Math.sin(Math.PI * 2 - startingAngle);

            const newPoint = {
                aEnd: findPointAfterRotation(centerX, centerY, a.x, a.y, rotation),
                bEnd: findPointAfterRotation(centerX, centerY, b.x, b.y, rotation),
            }

            return newPoint;
        }
        else if (rotation < 0) { 

            const h = radius;
            const centerX = a.x - h * Math.cos(Math.PI * 2 - startingAngle);
            const centerY = a.y + h * Math.sin(Math.PI * 2 - startingAngle);

            const newPoint = {
                aEnd: findPointAfterRotation(centerX, centerY, a.x, a.y, rotation),
                bEnd: findPointAfterRotation(centerX, centerY, b.x, b.y, rotation),
            }

            return newPoint;

        }
    }


    function drawArc(aRef, bRef, rotation, updatePoints=true) { 

        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");

        ctx.lineWidth = lineWidth;

        const a = aRef.current;
        const b = bRef.current;

        const startingAngle = Math.atan2(b.y - a.y, b.x - a.x);

        if (rotation >= 0) { 

            const h = radius + spacing;
            const centerX = a.x + h * Math.cos(Math.PI * 2 - startingAngle);
            const centerY = a.y - h * Math.sin(Math.PI * 2 - startingAngle);


            // draw border
            const r = radius + 0.5 * spacing
            ctx.beginPath();
            ctx.lineWidth = borderSize; 
            ctx.strokeStyle = borderColor;
            ctx.arc(centerX, centerY, r, startingAngle + Math.PI, startingAngle + Math.PI + rotation, false);
            ctx.stroke();
            ctx.lineWidth = lineWidth;

            colors.forEach((color, index) => { 

                const r = radius + (colors.length - index - 1) / (colors.length - 1) * spacing
    
                ctx.beginPath();
                ctx.strokeStyle = color;
                ctx.arc(centerX, centerY, r, startingAngle + Math.PI, startingAngle + Math.PI + rotation, false);
                ctx.stroke();
            })

            if (updatePoints === true) { 
                aRef.current = findPointAfterRotation(centerX, centerY, a.x, a.y, rotation);
                bRef.current = findPointAfterRotation(centerX, centerY, b.x, b.y, rotation);
            }


        }
        else if (rotation < 0) { 

            const h = radius;
            const centerX = a.x - h * Math.cos(Math.PI * 2 - startingAngle);
            const centerY = a.y + h * Math.sin(Math.PI * 2 - startingAngle);

            // drawCircle(centerX, centerY, radius / 2, "cyan");

            // draw border
            const r = radius + 0.5 * spacing;
            ctx.beginPath();
            ctx.lineWidth = borderSize;
            ctx.strokeStyle = borderColor;
            ctx.arc(centerX, centerY, r, startingAngle, startingAngle + rotation, true);
            ctx.stroke();
            ctx.lineWidth = lineWidth;
           

            colors.forEach((color, index) => { 
                
                const r = radius + (index / (colors.length - 1)) * spacing;

                ctx.beginPath();
                ctx.strokeStyle = color;
                ctx.arc(centerX, centerY, r, startingAngle, startingAngle + rotation, true);
                ctx.stroke();
            })

            if (updatePoints === true) { 
                aRef.current = findPointAfterRotation(centerX, centerY, a.x, a.y, rotation);
                bRef.current = findPointAfterRotation(centerX, centerY, b.x, b.y, rotation);
            }

        }

    }

    function degreesToRadians(degrees) { 
        return degrees * (Math.PI / 180);
    }

    function runArc(rotation) { 
        let animationRotation = 0;

        if (rotation >= 0) { 
            return new Promise((resolve) => { 
                function animateArc() { 
                    if (animationRotation + arcAnimationSpeed < rotation) { 
                        animationRotation += arcAnimationSpeed;
                        drawArc(a1Ref, b1Ref, degreesToRadians(animationRotation), false);
                        requestAnimationFrame(animateArc);
                    }
                    else { 
                        drawArc(a1Ref, b1Ref, degreesToRadians(rotation), true);
                        resolve();
                    }
                }
                animateArc();
            })
        }
        else if (rotation < 0) { 
            return new Promise((resolve) => { 
                function animateArc() { 
                    if (animationRotation - arcAnimationSpeed > rotation) { 
                        animationRotation -= arcAnimationSpeed;
                        drawArc(a1Ref, b1Ref, degreesToRadians(animationRotation), false);
                        requestAnimationFrame(animateArc);
                    }
                    else { 
                        drawArc(a1Ref, b1Ref, degreesToRadians(rotation), true);
                        resolve();
                    }
                }
                animateArc();
            })
        }

        
        
    }



    /*
    ------------------------------------------
                  Helper Functions
    ------------------------------------------
    */



    function findDistanceToEdge(a, b) { 

        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");





        const lengthAB = distance(a, b);

        const d = {
            x: (b.y - a.y) / lengthAB,
            y: (a.x - b.x) / lengthAB,
        };


   

        const minX = 0 + pad;
        const minY = 0 + pad;
        const maxX = canvas.width - pad;
        const maxY = canvas.height - pad;

        if (a.x < minX || a.x > maxX || a.y < minY || a.y > maxY) { 
            console.log("aye yo? ");
            return -1;
        }

        // if (a.x < minX) { 
        //     console.log("minX");
        //     return -1;
        // }
        // else if (a.x > maxX) { 
        //     console.log("maxX");
        //     return -1;
        // }
        // else if (a.y < minY) { 
        //     console.log("minY");
        //     return -1;
        // }
        // else if (a.y > maxY) { 
        //     console.log("maxY");
        //     return -1;
        // }



        let bottomT = -1;
        let topT = -1;
        let rightT = -1;
        let leftT = -1;

        // TODO handle this
        if (d.y != 0) { 
            // one of these will be negative and one will be positive
            bottomT = (maxY - a.y) / d.y;
            topT = (minY - a.y) / d.y;
        }
        if (d.x != 0) { 
            // again one will be negative and the other positive
            leftT = (minX - a.x) / d.x; 
            rightT = (maxX - a.x) / d.x;
        }

        
        // two will be negative, one is correct, one is outside of box -- return index 2
        const arr = [bottomT, topT, leftT, rightT];
        
        const positives = arr.filter(num => num > 0);

        if (positives.length === 0) { 
            return -1;
        }
        
        const t = Math.min(...positives);



        
        // ctx.beginPath();
        // ctx.lineWidth = 20;
        // ctx.strokeStyle = "green";
        // ctx.moveTo(a.x, a.y);
        // ctx.lineTo(a.x + t * d.x, a.y + t * d.y);
        // ctx.stroke();

        return t;



    }





    function drawCircle(x, y, radius, color) { 
        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");

        ctx.beginPath();
        ctx.arc(x, y, radius, 0, Math.PI * 2);
        ctx.fillStyle = color;
        ctx.fill();
        ctx.closePath();
    }

    function drawPoints(aRef, bRef) { 
        drawCircle(aRef.current.x, aRef.current.y, 10, "red");
        drawCircle(bRef.current.x, bRef.current.y, 10, "blue");
    }
    
    function resetBackground() { 
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        // ctx.fillStyle = "#572800";
        ctx.fillStyle = "#440044";
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

            if (event.key === "Enter") { 
                test();
            }
            else if (event.key === " ") { 
                resetBackground();
            }
            else if (event.key === "r") { 
                window.location.reload();
            }
            else if (event.key === "f") { 
                runLine(10000);
            }
            else if (event.key == "p") { 
                drawPoints(a1Ref, b1Ref);
            }
            else if (event.key == "k") { 
                startStopAnimation();
            }
        }


        document.addEventListener("keydown", handleKeyDown);

        return () => { 
            document.removeEventListener("keydown", handleKeyDown);
        }
    })

    /*
    ------------------------------------------
                 Movement Functions
    ------------------------------------------
    */


    async function randomWalk() { 
        const canvas = canvasRef.current;

        const testARef = {x: a1Ref.current.x, y: a1Ref.current.y};
        const testBRef = {x: b1Ref.current.x, y: b1Ref.current.y};

        while (true) {

            const distance = Math.random() * canvas.height;
            const rotation = Math.random() * 720 - 360;

            let movedPoints;
            movedPoints = movePointsLine(testARef, testBRef, distance);
            movedPoints = movePointsArc(movedPoints.aEnd, movedPoints.bEnd, rotation);

            const distanceToEdge = findDistanceToEdge(movedPoints.aEnd, movedPoints.bEnd);

            if (distanceToEdge > 0) { 
                await runLine(distance);
                await runArc(rotation);
                break;
            }

        }
    }

    async function startStopAnimation() { 

        run.current = !run.current;

        while (true) { 
            while (run.current) {
                await randomWalk();
            }
            break;
        }
    }

    async function test() { 

        

    /* 

    While True:
        try:
            find test endpoint values
            verify test enpoint values
            if good: 
                draw them 
                break
            else:
                run the loop again


    
    */

    for (let i = 0; i < 1000; i++) {
        await randomWalk();
    }
        
    // drawPoints(a1Ref, b1Ref);

    // let movedPoints = movePointsArc(a1Ref.current, b1Ref.current, - Math.PI / 2);
    // a1Ref.current = movedPoints.aEnd;
    // b1Ref.current = movedPoints.bEnd;

    // // drawLine(aRef, bRef, 400, true);
    // // drawArc(a1Ref, b1Ref, Math.PI / 2, true);


        
    // drawPoints(a1Ref, b1Ref);


       
    }

    

    

    return (
        <>
            <canvas ref={canvasRef} height='1000' width='2000'></canvas>

        </>
    )
}

export default RetroCanvas2;



