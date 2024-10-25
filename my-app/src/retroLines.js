import { hsvToHex, rgbToHsv, hsvToRgb } from "./colors";

export default class retroLines {

    constructor(canvasRef, isRunningRef) {

        this.canvasRef = canvasRef;
        this.isRunningRef = isRunningRef;

      
        

        this.a1Ref = {
            x: 0,
            y: 0,
        };
        this.b1Ref = {
            x: 0,
            y: 100,
        };

        this.lineWidth = 20;
        this.spacing = 70;
        this.radius = 30;
        this.pad = 0;
        this.arcAnimationSpeed = 40;
        this.lineAnimationSpeed = 40;
        this.colorSpeed = 0.0002;
        this.backgroundColor = [0, 0, 0];
        this.borderColor = [0, 0, 0];
        this.colors = [
            [358, 80, 69],
            [12, 75, 95],
            [26, 88, 98],
            [36, 88, 98],
            [40, 51, 100],
        ]; 

        this.run = false;

        this.borderSize = 70;
        this.movementStyle = "corner";

    }



    setParameters({ lineWidth, spacing, radius, pad, arcAnimationSpeed, lineAnimationSpeed, colorSpeed, backgroundColor, borderColor, colors, movementStyle }) { 
        this.lineWidth = lineWidth;
        this.spacing = spacing;
        this.radius = radius;
        this.pad = pad;
        this.arcAnimationSpeed = arcAnimationSpeed;
        this.lineAnimationSpeed = lineAnimationSpeed;
        this.colorSpeed = colorSpeed;
        this.backgroundColor = backgroundColor;
        this.borderColor = borderColor;
        this.colors = colors;


        this.borderSize = this.spacing;
        this.movementStyle = movementStyle;

     
    }


    



    /*
    ------------------------------------------
                    Draw Line
    ------------------------------------------
    */


    distance(a, b) { 
        return Math.sqrt((b.x - a.x)**2 + (b.y - a.y)**2);
    }

    // to calculate where points land without drawing them
    movePointsLine(a, b, length) { 


        const lengthAB = this.distance(a, b);

        const ab = {
            x: this.spacing * (b.x - a.x) / lengthAB,
            y: this.spacing * (b.y - a.y) / lengthAB,
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


    drawLine(aRef, bRef, length, updatePoints=true) {

        const canvas = this.canvasRef.current;
        const ctx = canvas.getContext('2d');
        ctx.lineWidth = this.lineWidth;

        

        const a = aRef;
        const b = bRef;


        const lengthAB = this.distance(a, b);

        const ab = {
            x: this.spacing * (b.x - a.x) / lengthAB,
            y: this.spacing * (b.y - a.y) / lengthAB,
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
        ctx.strokeStyle = hsvToHex(...this.borderColor);
        ctx.lineWidth = this.borderSize;
        ctx.moveTo(startXBorder, startYBorder);
        ctx.lineTo(endXBorder, endYBorder);
        ctx.stroke();


        ctx.lineWidth = this.lineWidth;

        const colorDistance = length * this.colorSpeed;



        this.colors.forEach((color, index) => { 

            let startX;
            let startY;
            let endX;
            let endY;

            
            if (this.colors.length > 1) {
                startX = a.x + (index / (this.colors.length - 1)) * ab.x - dNorm.x;
                startY = a.y + (index / (this.colors.length - 1)) * ab.y - dNorm.y;
                endX = a.x + d2.x + (index / (this.colors.length - 1)) * ab.x;
                endY = a.y + d2.y + (index / (this.colors.length - 1)) * ab.y;
            }
            else {
                startX = a.x + 0.5 * ab.x - dNorm.x;
                startY = a.y + 0.5 * ab.y - dNorm.y;
                endX = a.x + d2.x + 0.5 * ab.x;
                endY = a.y + d2.y + 0.5 * ab.y;
            }

            const gradient = ctx.createLinearGradient(startX, startY, endX, endY);

            const next_color = [(color[0] + colorDistance) % 360, color[1], color[2]];

            gradient.addColorStop(0, hsvToHex(...color));
            gradient.addColorStop(1, hsvToHex(...next_color));

  
            

            ctx.beginPath();
            ctx.strokeStyle = gradient;

            ctx.moveTo(startX, startY);
            ctx.lineTo(endX, endY);
            ctx.stroke();

            

        })

        // true when animation is over
        if (updatePoints === true) { 
            this.a1Ref = {
                x: a.x + d.x,
                y: a.y + d.y,
            };
    
            this.b1Ref = {
                x: a.x + d.x + ab.x,
                y: a.y + d.y + ab.y,
            };

            // const newColors = colors;
            // newColors.map((hsvSubArray => { 
            //     return [hsvSubArray[0] + colorDistance, hsvSubArray[1], hsvSubArray[2]];
            // }))
            // colors = newColors;
            this.updateColors(colorDistance);

        }

        
 

    };

    runLine(length) { 
        let animationLength = 0;



        return new Promise((resolve) => { 
            const animateLine = () => { 
                if (animationLength + this.lineAnimationSpeed < length) { 
                    animationLength += this.lineAnimationSpeed;
                    this.drawLine(this.a1Ref, this.b1Ref, animationLength, false);
                    requestAnimationFrame(animateLine);
                }
                else { 
                    this.drawLine(this.a1Ref, this.b1Ref, length, false);
                    this.drawLine(this.a1Ref, this.b1Ref, length, false);
                    this.drawLine(this.a1Ref, this.b1Ref, length, true)
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


    findPointAfterRotation(centerX, centerY, outerX, outerY, rotation) { 
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
    movePointsArc(a, b, rotation) {

        const startingAngle = Math.atan2(b.y - a.y, b.x - a.x);

        if (rotation >= 0) { 
            const h = this.radius + this.spacing;
            const centerX = a.x + h * Math.cos(Math.PI * 2 - startingAngle);
            const centerY = a.y - h * Math.sin(Math.PI * 2 - startingAngle);

            const newPoint = {
                aEnd: this.findPointAfterRotation(centerX, centerY, a.x, a.y, rotation),
                bEnd: this.findPointAfterRotation(centerX, centerY, b.x, b.y, rotation),
            }

            return newPoint;
        }
        else if (rotation < 0) { 

            const h = this.radius;
            const centerX = a.x - h * Math.cos(Math.PI * 2 - startingAngle);
            const centerY = a.y + h * Math.sin(Math.PI * 2 - startingAngle);

            const newPoint = {
                aEnd: this.findPointAfterRotation(centerX, centerY, a.x, a.y, rotation),
                bEnd: this.findPointAfterRotation(centerX, centerY, b.x, b.y, rotation),
            }

            return newPoint;

        }
    }


    drawArc(aRef, bRef, rotation, updatePoints=true) { 

        const canvas = this.canvasRef.current;
        const ctx = canvas.getContext("2d");

        ctx.lineWidth = this.lineWidth;

        const a = aRef;
        const b = bRef;

        const startingAngle = Math.atan2(b.y - a.y, b.x - a.x);

        if (rotation >= 0) { 

            const h = this.radius + this.spacing;
            const centerX = a.x + h * Math.cos(Math.PI * 2 - startingAngle);
            const centerY = a.y - h * Math.sin(Math.PI * 2 - startingAngle);


            // draw border
            const r = this.radius + 0.5 * this.spacing
            ctx.beginPath();
            ctx.lineWidth = this.borderSize; 
            ctx.strokeStyle = hsvToHex(...this.borderColor);
            ctx.arc(centerX, centerY, r, startingAngle + Math.PI, startingAngle + Math.PI + rotation, false);
            ctx.stroke();
            ctx.lineWidth = this.lineWidth;

            
            const colorDistance = r * (2 * Math.PI) * (rotation / (Math.PI * 2)) * this.colorSpeed;

            this.colors.forEach((color, index) => { 

                let r;

                if (this.colors.length > 1) { 
                    r = this.radius + (this.colors.length - index - 1) / (this.colors.length - 1) * this.spacing;
                }
                else { 
                    r = this.radius + 0.5 * this.spacing;
                }

        
    
                ctx.beginPath();

                
                const startX = centerX + r * Math.cos(startingAngle + Math.PI);
                const startY = centerY + r * Math.sin(startingAngle + Math.PI);
                const endX = centerX + r * Math.cos(startingAngle + Math.PI + rotation);
                const endY = centerY + r * Math.sin(startingAngle + Math.PI + rotation);

                


                const gradient = ctx.createLinearGradient(startX, startY, endX, endY);
                const next_color = [(color[0] + colorDistance) % 360, color[1], color[2]];
                gradient.addColorStop(0, hsvToHex(...color));
                gradient.addColorStop(1, hsvToHex(...next_color));
                ctx.strokeStyle = gradient;

                ctx.arc(centerX, centerY, r, startingAngle + Math.PI, startingAngle + Math.PI + rotation, false);
                ctx.stroke();
            })

            if (updatePoints === true) { 
                this.a1Ref = this.findPointAfterRotation(centerX, centerY, a.x, a.y, rotation);
                this.b1Ref = this.findPointAfterRotation(centerX, centerY, b.x, b.y, rotation);
                this.updateColors(colorDistance);
            }


        }
        else if (rotation < 0) { 

            const h = this.radius;
            const centerX = a.x - h * Math.cos(Math.PI * 2 - startingAngle);
            const centerY = a.y + h * Math.sin(Math.PI * 2 - startingAngle);

            // drawCircle(centerX, centerY, radius / 2, "cyan");

            // draw border
            const r = this.radius + 0.5 * this.spacing;
            ctx.beginPath();
            ctx.lineWidth = this.borderSize;
            ctx.strokeStyle = hsvToHex(...this.borderColor);
            ctx.arc(centerX, centerY, r, startingAngle, startingAngle + rotation, true);
            ctx.stroke();
            ctx.lineWidth = this.lineWidth;

            // sets the reference
            const colorDistance = r * (2 * Math.PI) * (-1 * rotation / (Math.PI * 2)) * this.colorSpeed;
           

            this.colors.forEach((color, index) => { 
                

                let r;

                if (this.colors.length > 1) {
                    r = this.radius + (index / (this.colors.length - 1)) * this.spacing;
                }
                else { 
                    r = this.radius + 0.5 * this.spacing;
                }
                

                ctx.beginPath();

                const startX = centerX + r * Math.cos(startingAngle + Math.PI);
                const startY = centerY + r * Math.sin(startingAngle + Math.PI);
                const endX = centerX + r * Math.cos(startingAngle + Math.PI + rotation);
                const endY = centerY + r * Math.sin(startingAngle + Math.PI + rotation);

                const gradient = ctx.createLinearGradient(startX, startY, endX, endY);
                const next_color = [(color[0] + colorDistance) % 360, color[1], color[2]];
                gradient.addColorStop(0, hsvToHex(...next_color));
                gradient.addColorStop(1, hsvToHex(...color));
                ctx.strokeStyle = gradient;





                ctx.arc(centerX, centerY, r, startingAngle, startingAngle + rotation, true);
                ctx.stroke();
            })

            if (updatePoints === true) { 
                this.a1Ref = this.findPointAfterRotation(centerX, centerY, a.x, a.y, rotation);
                this.b1Ref = this.findPointAfterRotation(centerX, centerY, b.x, b.y, rotation);
                
                this.updateColors(colorDistance);
            }

        }

    }

    degreesToRadians(degrees) { 
        return degrees * (Math.PI / 180);
    }

    runArc(rotation) { 
        let animationRotation = 0;

        if (rotation >= 0) { 
            return new Promise((resolve) => { 
                const animateArc = () => { 
                    if (animationRotation + this.arcAnimationSpeed < rotation) { 
                        animationRotation += this.arcAnimationSpeed;
                        this.drawArc(this.a1Ref, this.b1Ref, this.degreesToRadians(animationRotation), false);
                        requestAnimationFrame(animateArc);
                    }
                    else { 
                        this.drawArc(this.a1Ref, this.b1Ref, this.degreesToRadians(rotation), true);
                        resolve();
                    }
                }
                animateArc();
            })
        }
        else if (rotation < 0) { 
            return new Promise((resolve) => { 
                const animateArc = () => { 
                    if (animationRotation - this.arcAnimationSpeed > rotation) { 
                        animationRotation -= this.arcAnimationSpeed;
                        this.drawArc(this.a1Ref, this.b1Ref, this.degreesToRadians(animationRotation), false);
                        requestAnimationFrame(animateArc);
                    }
                    else { 
                        this.drawArc(this.a1Ref, this.b1Ref, this.degreesToRadians(rotation), true);
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



    findDistanceToEdge(a, b) { 

        const canvas = this.canvasRef.current;
        const ctx = canvas.getContext("2d");





        const lengthAB = this.distance(a, b);

        const d = {
            x: (b.y - a.y) / lengthAB,
            y: (a.x - b.x) / lengthAB,
        };


   

        const minX = 0 + this.pad;
        const minY = 0 + this.pad;
        const maxX = canvas.width - this.pad;
        const maxY = canvas.height - this.pad;

        if (a.x < minX || a.x > maxX || a.y < minY || a.y > maxY) { 
            // console.log("aye yo? ");
            return -1;
        }


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


        return t;



    }





    drawCircle(x, y, radius, color) { 
        const canvas = this.canvasRef.current;
        const ctx = canvas.getContext("2d");

        ctx.beginPath();
        ctx.arc(x, y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = color;
        ctx.fill();
        ctx.closePath();
    }

    drawPoints(aRef, bRef) { 
        this.drawCircle(aRef.x, aRef.y, 10, "red");
        this.drawCircle(bRef.x, bRef.y, 10, "blue");
    }
    








    updateColors(distance) { 


        const newColors = this.colors.map((hsvSubArray => { 
            return [(hsvSubArray[0] + distance) % 360, hsvSubArray[1], hsvSubArray[2]];
        }))

        this.colors = newColors;
    }


    fadeByOpacity(distance) { 
        const canvas = this.canvasRef.current;
        const ctx = canvas.getContext("2d");



        ctx.fillStyle = `rgb(0, 0, 0, ${distance})`;
        ctx.fillRect(0, 0, canvas.width, canvas.height);



    }

    fadeByRGB(distance) { 
        const canvas = this.canvasRef.current;
        const ctx = canvas.getContext("2d");
        
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;

        for (let i = 0; i < data.length; i += 4) { 
            data[i] = Math.max(0, data[i] - distance);
            data[i+1] = Math.max(0, data[i+1] - distance);
            data[i+2] = Math.max(0, data[i+2] - distance);
        }

        ctx.putImageData(imageData, 0, 0);
    }


    fadeByOpacityMultiple(rate) { 
        const canvas = this.canvasRef.current;
        const ctx = canvas.getContext("2d");
        
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;

        for (let i = 0; i < data.length; i += 4) { 
            data[i] = Math.max(0, Math.floor(data[i] *= rate));
            data[i+1] = Math.max(0, Math.floor(data[i+1] *= rate));
            data[i+2] = Math.max(0, Math.floor(data[i+2] *= rate));
        }

        ctx.putImageData(imageData, 0, 0);
    }







    /*
    ------------------------------------------
                 Movement Functions
    ------------------------------------------
    */


    async randomWalk() { 
        const canvas = this.canvasRef.current;

        

        const testARef = {x: this.a1Ref.x, y: this.a1Ref.y};
        const testBRef = {x: this.b1Ref.x, y: this.b1Ref.y};


        while (true) {

            const distance = Math.random() * canvas.height;
            const rotation = Math.random() * 720 - 360;

            let movedPoints;
            movedPoints = this.movePointsLine(testARef, testBRef, distance);
            movedPoints = this.movePointsArc(movedPoints.aEnd, movedPoints.bEnd, rotation);

            const distanceToEdge = this.findDistanceToEdge(movedPoints.aEnd, movedPoints.bEnd);

            if (distanceToEdge > 0) { 
                await this.runLine(distance);
                await this.runArc(rotation);
                break;
            }

        }
    }

    async cornerWalk() { 
        const canvas = this.canvasRef.current;

        const testARef = {x: this.a1Ref.x, y: this.a1Ref.y};
        const testBRef = {x: this.b1Ref.x, y: this.b1Ref.y};

        while (true) {

            const distance = Math.random() * 800;
            const rotation = Math.round(Math.random() * 6 - 3) * 90;
            

            let movedPoints;
            movedPoints = this.movePointsLine(testARef, testBRef, distance);
            movedPoints = this.movePointsArc(movedPoints.aEnd, movedPoints.bEnd, rotation);

            const distanceToEdge = this.findDistanceToEdge(movedPoints.aEnd, movedPoints.bEnd);

            if (distanceToEdge > 0) { 
                await this.runLine(distance);
                await this.runArc(rotation);
                break;
            }

        }
    }

    async startStopAnimation() { 



        this.isRunningRef.current = !this.isRunningRef.current;

    

        if (this.movementStyle === "random") { 
            while (true) { 
                while (this.isRunningRef.current) {
                    await this.randomWalk();
                    // this.fadeByOpacityMultiple(0.99);
                }
                break;
            }
        }
        else if (this.movementStyle === "corner") {
            while (true) { 
                while (this.isRunningRef.current) {
                    await this.cornerWalk();
                    // this.fadeByOpacityMultiple(0.99);
                }
                break;
            }
        }

       
    }



    

}

