/* =========================================================
   HEADRUN
   GAME.JS
========================================================= */


/* =========================================================
   ELEMENTS
========================================================= */

const game =
    document.getElementById("game");

const player =
    document.getElementById("player");

const canvas =
    document.getElementById("stickman");

const ctx =
    canvas.getContext("2d");

const face =
    document.getElementById("faceImage");

const obstacles =
    document.getElementById("obstacles");

const particles =
    document.getElementById("particles");

const scoreEl =
    document.getElementById("score");

const finalScoreEl =
    document.getElementById("finalScore");

const bestScoreEl =
    document.getElementById("bestScore");

const homeBestScoreEl =
    document.getElementById("homeBestScore");

const startScreen =
    document.getElementById("startScreen");

const gameOverScreen =
    document.getElementById("gameOver");

const startBtn =
    document.getElementById("startBtn");

const restartBtn =
    document.getElementById("restartBtn");

const characterCards =
    document.querySelectorAll(
        ".character-card"
    );


/* =========================================================
   CHARACTERS
========================================================= */

const characters = {

    chunnilal: {
        name: "CHUNNILAL",
        image: "Chunnilal.png.jpeg"
    },

    alvin: {
        name: "ALVIN",
        image: "Alvin.png.jpeg"
    },

    rishab: {
        name: "RISHAB",
        image: "Rishab.png.jpeg"
    },

    angath: {
        name: "ANGATH",
        image: "Angath.png.jpeg"
    }

};


let selectedCharacter =
    "chunnilal";


/* =========================================================
   GAME STATE
========================================================= */

let gameRunning = false;

let jumping = false;

let playerY = 0;

let velocityY = 0;

let score = 0;

let speed = 10;

let animationFrame = 0;

let lastTime = 0;

let runTime = 0;

let jumpTime = 0;

let landingTime = 0;

let worldScroll = 0;


/* =========================================================
   OBSTACLES
========================================================= */

let distanceSinceSpawn = 0;

let nextSpawnDistance = 82;

let firstObstacle = true;

const MAX_ACTIVE_OBSTACLES = 2;


/* =========================================================
   PHYSICS
========================================================= */

const GRAVITY = 0.72;

const JUMP_POWER = 14.5;


/* =========================================================
   SPEED
========================================================= */

const START_SPEED = 10;

const MAX_SPEED = 18;


/* =========================================================
   HELPERS
========================================================= */

function clamp(value, min, max) {

    return Math.max(
        min,
        Math.min(max, value)
    );

}


function smooth(t) {

    t = clamp(t, 0, 1);

    return t * t * (3 - 2 * t);

}


function mixColor(a, b, t) {

    return [

        Math.round(
            a[0] +
            (b[0] - a[0]) * t
        ),

        Math.round(
            a[1] +
            (b[1] - a[1]) * t
        ),

        Math.round(
            a[2] +
            (b[2] - a[2]) * t
        )

    ];

}


function rgb(color) {

    return `rgb(
        ${color[0]},
        ${color[1]},
        ${color[2]}
    )`;

}


/* =========================================================
   SKY
========================================================= */

function createSkySystem() {

    let sky =
        document.getElementById(
            "headrunSky"
        );


    if (!sky) {

        sky =
            document.createElement(
                "div"
            );

        sky.id =
            "headrunSky";

        Object.assign(
            sky.style,
            {
                position: "absolute",
                inset: "0",
                width: "100%",
                height: "100%",
                pointerEvents: "none",
                zIndex: "0",
                overflow: "hidden"
            }
        );


        game.insertBefore(
            sky,
            game.firstChild
        );

    }


    const oldSky =
        document.querySelector(
            ".sky"
        );


    if (oldSky) {

        oldSky.style.background =
            "transparent";

        oldSky.style.zIndex =
            "1";

    }


    createStars();

}


/* =========================================================
   STARS
========================================================= */

function createStars() {

    if (
        document.getElementById(
            "nightStars"
        )
    ) {

        return;

    }


    const stars =
        document.createElement(
            "div"
        );

    stars.id =
        "nightStars";


    Object.assign(
        stars.style,
        {
            position: "absolute",
            inset: "0",
            pointerEvents: "none",
            zIndex: "4",
            opacity: "0"
        }
    );


    const positions = [

        [5,12],
        [10,27],
        [16,8],
        [22,35],
        [28,17],
        [34,29],
        [40,11],
        [46,24],
        [52,7],
        [58,31],
        [64,16],
        [70,27],
        [76,10],
        [82,34],
        [89,18],
        [95,8],

        [7,46],
        [15,57],
        [25,43],
        [36,51],
        [47,44],
        [59,52],
        [71,45],
        [84,56],
        [94,43],

        [12,67],
        [31,62],
        [49,70],
        [66,64],
        [81,68],
        [92,61],

        [3,31],
        [44,6],
        [73,7],
        [87,28]

    ];


    positions.forEach(
        ([x,y], index) => {

            const star =
                document.createElement(
                    "span"
                );


            Object.assign(
                star.style,
                {
                    position: "absolute",

                    left:
                        `${x}%`,

                    top:
                        `${y}%`,

                    width:
                        index % 5 === 0
                            ? "3px"
                            : "2px",

                    height:
                        index % 5 === 0
                            ? "3px"
                            : "2px",

                    borderRadius:
                        "50%",

                    background:
                        "#fff",

                    boxShadow:
                        "0 0 9px rgba(255,255,255,.95)"
                }
            );


            stars.appendChild(
                star
            );

        }
    );


    game.appendChild(
        stars
    );

}


/* =========================================================
   DAY / NIGHT
========================================================= */

function updateDayNight() {

    const sky =
        document.getElementById(
            "headrunSky"
        );


    if (!sky) {
        return;
    }


    const cycle = 2400;

    const phase =
        score % cycle;


    const DAY_TOP =
        [182,239,142];

    const DAY_BOTTOM =
        [229,247,164];

    const SUNSET_TOP =
        [245,164,104];

    const SUNSET_BOTTOM =
        [255,204,126];

    const NIGHT_TOP =
        [5,18,42];

    const NIGHT_BOTTOM =
        [13,43,76];

    const DAWN_TOP =
        [63,105,148];

    const DAWN_BOTTOM =
        [181,210,181];


    let top;
    let bottom;

    let starsOpacity;
    let cloudOpacity;
    let sunOpacity;


    if (phase < 650) {

        const t =
            smooth(
                phase / 650
            );


        top =
            mixColor(
                DAY_TOP,
                [150,221,174],
                t
            );


        bottom =
            mixColor(
                DAY_BOTTOM,
                [179,232,183],
                t
            );


        starsOpacity = 0;

        cloudOpacity = .46;

        sunOpacity = .78;

    }


    else if (phase < 900) {

        const t =
            smooth(
                (phase - 650) / 250
            );


        top =
            mixColor(
                [150,221,174],
                SUNSET_TOP,
                t
            );


        bottom =
            mixColor(
                [179,232,183],
                SUNSET_BOTTOM,
                t
            );


        starsOpacity =
            .03 +
            (.55 * t);


        cloudOpacity =
            .46 -
            (.30 * t);


        sunOpacity =
            .78 * (1 - t);

    }


    else if (phase < 1700) {

        const t =
            smooth(
                (phase - 900) / 800
            );


        top =
            mixColor(
                SUNSET_TOP,
                NIGHT_TOP,
                t
            );


        bottom =
            mixColor(
                SUNSET_BOTTOM,
                NIGHT_BOTTOM,
                t
            );


        starsOpacity =
            .65 +
            (.35 * t);


        cloudOpacity =
            .16 -
            (.06 * t);


        sunOpacity = 0;

    }


    else if (phase < 1950) {

        const t =
            smooth(
                (phase - 1700) / 250
            );


        top =
            mixColor(
                NIGHT_TOP,
                DAWN_TOP,
                t
            );


        bottom =
            mixColor(
                NIGHT_BOTTOM,
                DAWN_BOTTOM,
                t
            );


        starsOpacity =
            1 - t;


        cloudOpacity =
            .10 +
            (.30 * t);


        sunOpacity =
            .25 * t;

    }


    else {

        const t =
            smooth(
                (phase - 1950) / 450
            );


        top =
            mixColor(
                DAWN_TOP,
                DAY_TOP,
                t
            );


        bottom =
            mixColor(
                DAWN_BOTTOM,
                DAY_BOTTOM,
                t
            );


        starsOpacity = 0;

        cloudOpacity =
            .40 +
            (.06 * t);

        sunOpacity =
            .25 +
            (.53 * t);

    }


    sky.style.background =
        `linear-gradient(
            135deg,
            ${rgb(top)},
            ${rgb(bottom)}
        )`;


    const stars =
        document.getElementById(
            "nightStars"
        );


    if (stars) {

        stars.style.opacity =
            starsOpacity;

    }


    document
        .querySelectorAll(".cloud")
        .forEach(
            cloud => {

                cloud.style.opacity =
                    cloudOpacity;

            }
        );


    const sun =
        document.querySelector(
            ".sun"
        );


    if (sun) {

        sun.style.opacity =
            sunOpacity;

    }

}


/* =========================================================
   CHARACTER SELECTION
========================================================= */

characterCards.forEach(
    card => {

        card.addEventListener(
            "click",
            event => {

                event.stopPropagation();


                if (gameRunning) {
                    return;
                }


                characterCards.forEach(
                    item => {

                        item.classList.remove(
                            "active"
                        );

                    }
                );


                card.classList.add(
                    "active"
                );


                selectedCharacter =
                    card.dataset.character;


                face.src =
                    characters[
                        selectedCharacter
                    ].image;


                drawCharacter();

            }
        );

    }
);


/* =========================================================
   STICKMAN
   SIDE-FACING RUNNER
========================================================= */

function line(
    x1,
    y1,
    x2,
    y2,
    width = 8
) {

    ctx.beginPath();

    ctx.moveTo(
        x1,
        y1
    );

    ctx.lineTo(
        x2,
        y2
    );

    ctx.lineWidth =
        width;

    ctx.lineCap =
        "round";

    ctx.lineJoin =
        "round";

    ctx.strokeStyle =
        "#171722";

    ctx.stroke();

}


function joint(
    x,
    y,
    radius = 4
) {

    ctx.beginPath();

    ctx.arc(
        x,
        y,
        radius,
        0,
        Math.PI * 2
    );

    ctx.fillStyle =
        "#171722";

    ctx.fill();

}


function shoe(
    x,
    y,
    angle
) {

    ctx.save();

    ctx.translate(
        x,
        y
    );

    ctx.rotate(
        angle
    );

    /* White sneaker */

    ctx.beginPath();

    ctx.roundRect(
        -15,
        -6,
        30,
        12,
        6
    );

    ctx.fillStyle =
        "#ffffff";

    ctx.fill();

    /* Dark sole */

    ctx.beginPath();

    ctx.roundRect(
        -15,
        4,
        30,
        3,
        2
    );

    ctx.fillStyle =
        "#171722";

    ctx.fill();

    ctx.restore();

}


/* =========================================================
   RUNNING ANIMATION
   SIDE-FACING RIGHT RUNNER
========================================================= */

function drawCharacter() {

    ctx.clearRect(
        0,
        0,
        canvas.width,
        canvas.height
    );


    if (gameRunning) {

        runTime +=
            .016;

    }


    /*
       Smooth running cycle.
       The body clearly faces RIGHT.
    */

    const cycle =
        Math.sin(
            runTime * 11
        );

    const opposite =
        Math.sin(
            runTime * 11 +
            Math.PI
        );


    /* =====================================================
       BODY
    ====================================================== */

    const shoulderX = 87;
    const shoulderY = 94;

    const hipX = 103;
    const hipY = 153;


    /*
       Slight forward lean.
    */

    line(
        shoulderX,
        shoulderY,
        hipX,
        hipY,
        9
    );


    /* =====================================================
       ARMS
    ====================================================== */

    if (!jumping) {

        /*
           FRONT ARM
        */

        const frontArm =
            cycle * 14;

        const frontElbowX =
            116 + frontArm;

        const frontElbowY =
            113 -
            Math.abs(cycle) * 4;

        const frontHandX =
            140 + frontArm;

        const frontHandY =
            100 -
            cycle * 5;


        line(
            91,
            96,
            frontElbowX,
            frontElbowY,
            7
        );

        line(
            frontElbowX,
            frontElbowY,
            frontHandX,
            frontHandY,
            7
        );


        /*
           REAR ARM
        */

        const rearArm =
            opposite * 13;

        const rearElbowX =
            70 + rearArm;

        const rearElbowY =
            119 +
            Math.abs(opposite) * 4;

        const rearHandX =
            50 + rearArm;

        const rearHandY =
            137 +
            opposite * 5;


        line(
            85,
            97,
            rearElbowX,
            rearElbowY,
            7
        );

        line(
            rearElbowX,
            rearElbowY,
            rearHandX,
            rearHandY,
            7
        );


        joint(
            frontElbowX,
            frontElbowY,
            4
        );

        joint(
            rearElbowX,
            rearElbowY,
            4
        );


        joint(
            frontHandX,
            frontHandY,
            3.5
        );

        joint(
            rearHandX,
            rearHandY,
            3.5
        );

    }


    else {

        /*
           SIDE-FACING JUMP POSE
        */

        line(
            90,
            98,
            118,
            112,
            7
        );

        line(
            118,
            112,
            143,
            101,
            7
        );


        line(
            84,
            99,
            62,
            118,
            7
        );

        line(
            62,
            118,
            43,
            108,
            7
        );


        joint(
            118,
            112,
            4
        );

        joint(
            62,
            118,
            4
        );


        joint(
            143,
            101,
            3.5
        );

        joint(
            43,
            108,
            3.5
        );

    }


    /* =====================================================
       LEGS
    ====================================================== */

    if (!jumping) {

        /*
           FRONT LEG
        */

        const frontStride =
            cycle * 24;

        const frontKneeX =
            118 +
            frontStride;

        const frontKneeY =
            183 -
            Math.abs(cycle) * 13;

        const frontFootX =
            143 +
            frontStride * 1.15;

        const frontFootY =
            220 -
            Math.abs(cycle) * 5;


        /*
           REAR LEG
        */

        const rearStride =
            opposite * 24;

        const rearKneeX =
            87 +
            rearStride;

        const rearKneeY =
            184 -
            Math.abs(opposite) * 13;

        const rearFootX =
            59 +
            rearStride * 1.15;

        const rearFootY =
            220 -
            Math.abs(opposite) * 5;


        /*
           REAR LEG FIRST
        */

        line(
            98,
            hipY,
            rearKneeX,
            rearKneeY,
            9
        );

        line(
            rearKneeX,
            rearKneeY,
            rearFootX,
            rearFootY,
            9
        );


        /*
           FRONT LEG
        */

        line(
            106,
            hipY,
            frontKneeX,
            frontKneeY,
            9
        );

        line(
            frontKneeX,
            frontKneeY,
            frontFootX,
            frontFootY,
            9
        );


        joint(
            rearKneeX,
            rearKneeY,
            4
        );

        joint(
            frontKneeX,
            frontKneeY,
            4
        );


        shoe(
            rearFootX,
            rearFootY,
            -0.12 +
            opposite * .12
        );

        shoe(
            frontFootX,
            frontFootY,
            0.10 +
            cycle * .12
        );

    }


    else {

        /*
           SIDE-FACING JUMPING LEGS
        */

        line(
            96,
            hipY,
            73,
            182,
            9
        );

        line(
            73,
            182,
            49,
            199,
            9
        );


        line(
            105,
            hipY,
            125,
            178,
            9
        );

        line(
            125,
            178,
            153,
            190,
            9
        );


        joint(
            73,
            182,
            4
        );

        joint(
            125,
            178,
            4
        );


        shoe(
            49,
            199,
            -0.25
        );

        shoe(
            153,
            190,
            0.18
        );

    }


    /* =====================================================
       HIP
    ====================================================== */

    joint(
        hipX,
        hipY,
        5
    );


    /* =====================================================
       LANDING ANIMATION
    ====================================================== */

    if (
        landingTime > 0 &&
        !jumping
    ) {

        landingTime -=
            .016;


        const squash =
            1 +
            Math.sin(
                landingTime * 18
            ) * .035;


        player.style.transform =
            `scaleY(${squash})`;

    }

    else {

        player.style.transform =
            "translateZ(0)";

    }


    /* =====================================================
       HEAD BOUNCE
    ====================================================== */

    const bounce =
        jumping
            ? 0
            : Math.abs(
                Math.sin(
                    runTime * 11
                )
            ) * 2;


    face.style.transform =
        `translateY(${-bounce}px)`;

}


/* =========================================================
   PARTICLES
========================================================= */

function spawnParticles(count) {

    const rect =
        player.getBoundingClientRect();


    for (
        let i = 0;
        i < count;
        i++
    ) {

        const particle =
            document.createElement(
                "span"
            );


        particle.className =
            "particle";


        particle.style.left =
            `${rect.left + 60 +
            Math.random() * 40}px`;


        particle.style.top =
            `${rect.bottom - 8}px`;


        particle.style.setProperty(
            "--x",
            `${-20 +
            Math.random() * 40}px`
        );


        particle.style.setProperty(
            "--y",
            `${-10 -
            Math.random() * 25}px`
        );


        particles.appendChild(
            particle
        );


        setTimeout(
            () => {

                particle.remove();

            },
            650
        );

    }

}


/* =========================================================
   JUMP
========================================================= */

function jump() {

    if (!gameRunning) {
        return;
    }


    if (jumping) {
        return;
    }


    jumping = true;

    velocityY =
        JUMP_POWER;

    jumpTime = 0;

    spawnParticles(3);

}


/* =========================================================
   DIFFICULTY
========================================================= */

function getDifficulty() {

    return Math.min(
        12,
        1 +
        Math.floor(
            score / 200
        )
    );

}


/* =========================================================
   SPEED
========================================================= */

function updateSpeed() {

    if (score < 100) {

        const progress =
            score / 100;


        speed =
            START_SPEED +
            progress;

    }

    else {

        const extraDistance =
            score - 100;


        const increases =
            Math.floor(
                extraDistance / 500
            );


        speed =
            11 +
            increases * .5;

    }


    speed =
        Math.min(
            speed,
            MAX_SPEED
        );

}


/* =========================================================
   OBSTACLE TYPE
========================================================= */

function chooseObstacleType(
    difficulty
) {

    const random =
        Math.random();


    if (
        difficulty >= 8 &&
        random < .12
    ) {

        return "barrier";

    }


    if (
        difficulty >= 6 &&
        random < .25
    ) {

        return "log";

    }


    if (
        difficulty >= 3 &&
        random < .44
    ) {

        return "cone";

    }


    if (
        random < .63
    ) {

        return "cactus";

    }


    if (
        random < .82
    ) {

        return "rock";

    }


    return "block";

}


/* =========================================================
   CREATE OBSTACLE
========================================================= */

function createObstacle(
    difficulty = 1
) {

    if (
        obstacles.children.length >=
        MAX_ACTIVE_OBSTACLES
    ) {

        return;

    }


    const obstacle =
        document.createElement(
            "div"
        );


    const type =
        chooseObstacleType(
            difficulty
        );


    obstacle.className =
        `obstacle ${type}`;


    if (type === "cactus") {

        obstacle.innerHTML = `
            <div class="cactus-body"></div>
        `;

    }


    else if (type === "rock") {

        obstacle.innerHTML = `
            <div class="rock-shape"></div>
        `;

    }


    else if (type === "block") {

        obstacle.innerHTML = `
            <div class="block-shape"></div>
        `;

    }


    else if (type === "cone") {

        obstacle.innerHTML = `

            <div class="cone-shape">

                <div class="cone-tip"></div>

                <div class="cone-body"></div>

                <div class="cone-band band-1"></div>

                <div class="cone-band band-2"></div>

                <div class="cone-base"></div>

            </div>

        `;

    }


    else if (type === "barrier") {

        obstacle.innerHTML = `

            <div class="barrier-board"></div>

            <div class="barrier-post left"></div>

            <div class="barrier-post right"></div>

        `;

    }


    else if (type === "log") {

        obstacle.innerHTML = `

            <div class="log-body"></div>

            <div class="log-end"></div>

        `;

    }


    const size =
        Math.min(
            1.22,
            1.08 +
            difficulty * .012
        );


    obstacle.dataset.size =
        size;


    obstacle.dataset.right =
        "-180";


    obstacle.style.right =
        "-180px";


    obstacle.style.transform =
        `scale(${size})`;


    obstacles.appendChild(
        obstacle
    );

}


/* =========================================================
   OBSTACLE GAP
========================================================= */

function chooseNextSpawnDistance(
    difficulty
) {

    const progress =
        Math.min(
            1,
            score / 2000
        );


    const minGap =
        82 -
        progress * 32;


    const maxGap =
        112 -
        progress * 32;


    const randomGap =
        minGap +
        Math.random() *
        (
            maxGap -
            minGap
        );


    return Math.max(
        48,
        randomGap
    );

}


/* =========================================================
   UPDATE OBSTACLES
========================================================= */

function updateObstacles(
    delta
) {

    const difficulty =
        getDifficulty();


    const distanceMoved =
        speed *
        delta *
        .055;


    const pixelsMoved =
        speed *
        delta *
        1.15;


    distanceSinceSpawn +=
        distanceMoved;


    worldScroll +=
        pixelsMoved;


    if (
        firstObstacle &&
        score >= 35
    ) {

        if (
            obstacles.children.length === 0
        ) {

            createObstacle(
                difficulty
            );


            firstObstacle =
                false;


            distanceSinceSpawn =
                0;


            nextSpawnDistance =
                82 +
                Math.random() * 28;

        }

    }


    else if (
        !firstObstacle &&
        distanceSinceSpawn >=
        nextSpawnDistance
    ) {

        if (
            obstacles.children.length <
            MAX_ACTIVE_OBSTACLES
        ) {

            createObstacle(
                difficulty
            );

        }


        distanceSinceSpawn =
            0;


        nextSpawnDistance =
            chooseNextSpawnDistance(
                difficulty
            );

    }


    const list =
        [
            ...obstacles.children
        ];


    list.forEach(
        obstacle => {

            let right =
                parseFloat(
                    obstacle.dataset.right ||
                    "-180"
                );


            right +=
                pixelsMoved;


            obstacle.dataset.right =
                right;


            obstacle.style.right =
                `${right}px`;


            const size =
                parseFloat(
                    obstacle.dataset.size ||
                    "1.08"
                );


            obstacle.style.transform =
                `scale(${size})`;


            if (
                right >
                window.innerWidth +
                180
            ) {

                obstacle.remove();

                return;

            }


            checkCollision(
                obstacle
            );

        }
    );

}


/* =========================================================
   COLLISION
========================================================= */

function checkCollision(
    obstacle
) {

    const p =
        player.getBoundingClientRect();

    const o =
        obstacle.getBoundingClientRect();


    const paddingX = 30;

    const paddingTop = 24;

    const paddingBottom = 8;


    const hit =

        p.left +
        paddingX <
        o.right &&

        p.right -
        paddingX >
        o.left &&

        p.top +
        paddingTop <
        o.bottom &&

        p.bottom -
        paddingBottom >
        o.top;


    if (hit) {

        endGame();

    }

}


/* =========================================================
   PLAYER PHYSICS
========================================================= */

function updatePlayer(
    delta
) {

    if (jumping) {

        velocityY -=
            GRAVITY *
            delta;


        playerY +=
            velocityY *
            delta;


        if (
            playerY <= 0
        ) {

            playerY = 0;

            velocityY = 0;

            jumping = false;

            landingTime = .7;

            spawnParticles(4);

        }

    }


    player.style.bottom =
        `${-15 + playerY}px`;

}


/* =========================================================
   SCORE
========================================================= */

function updateScore(
    delta
) {

    score +=
        speed *
        delta *
        .035;


    scoreEl.textContent =
        Math.floor(score)
            .toString()
            .padStart(
                5,
                "0"
            );

}


/* =========================================================
   ROAD
========================================================= */

function updateRoadLines() {

    const lines =
        document.querySelector(
            ".road-lines"
        );


    if (!lines) {
        return;
    }


    const offset =
        -(worldScroll % 105);


    lines.style.transform =
        `translateX(${offset}px)`;

}


/* =========================================================
   GAME LOOP
========================================================= */

function gameLoop(
    time
) {

    if (!gameRunning) {
        return;
    }


    const delta =
        Math.min(
            2,
            (time - lastTime) /
            16.67
        );


    lastTime =
        time;


    updateSpeed();

    updateScore(delta);

    updatePlayer(delta);

    updateObstacles(delta);

    updateRoadLines();

    updateDayNight();

    drawCharacter();


    animationFrame =
        requestAnimationFrame(
            gameLoop
        );

}


/* =========================================================
   START GAME
========================================================= */

function startGame() {

    gameRunning = true;

    jumping = false;


    playerY = 0;

    velocityY = 0;

    score = 0;

    speed =
        START_SPEED;


    distanceSinceSpawn =
        0;

    nextSpawnDistance =
        75;

    firstObstacle =
        true;


    worldScroll = 0;

    runTime = 0;

    jumpTime = 0;

    landingTime = 0;


    obstacles.innerHTML =
        "";

    particles.innerHTML =
        "";


    scoreEl.textContent =
        "00000";


    player.style.bottom =
        "-15px";


    startScreen.style.display =
        "none";

    gameOverScreen.style.display =
        "none";


    const back =
        document.getElementById(
            "backHomeBtn"
        );


    if (back) {

        back.style.display =
            "none";

    }


    cancelAnimationFrame(
        animationFrame
    );


    lastTime =
        performance.now();


    updateDayNight();

    drawCharacter();


    animationFrame =
        requestAnimationFrame(
            gameLoop
        );

}


/* =========================================================
   GAME OVER
========================================================= */

function endGame() {

    if (!gameRunning) {
        return;
    }


    gameRunning = false;

    jumping = false;


    cancelAnimationFrame(
        animationFrame
    );


    const finalScore =
        Math.floor(score);


    finalScoreEl.textContent =
        String(finalScore)
            .padStart(
                5,
                "0"
            );


    let best =
        Number(
            localStorage.getItem(
                "headrun-best"
            ) || 0
        );


    if (
        finalScore >
        best
    ) {

        best =
            finalScore;


        localStorage.setItem(
            "headrun-best",
            best
        );

    }


    /* GAME OVER BEST */

    bestScoreEl.textContent =
        String(best)
            .padStart(
                5,
                "0"
            );


    /* HOME SCREEN BEST */

    if (homeBestScoreEl) {

        homeBestScoreEl.textContent =
            String(best)
                .padStart(
                    5,
                    "0"
                );

    }


    gameOverScreen.style.display =
        "flex";


    createBackHomeButton();

}


/* =========================================================
   BACK HOME
========================================================= */

function createBackHomeButton() {

    let button =
        document.getElementById(
            "backHomeBtn"
        );


    if (!button) {

        button =
            document.createElement(
                "button"
            );


        button.id =
            "backHomeBtn";


        button.textContent =
            "BACK TO HOME";


        restartBtn.parentNode.appendChild(
            button
        );


        button.addEventListener(
            "click",
            event => {

                event.stopPropagation();

                goHome();

            }
        );

    }


    button.style.display =
        "block";

}


/* =========================================================
   HOME
========================================================= */

function goHome() {

    gameRunning = false;

    jumping = false;


    cancelAnimationFrame(
        animationFrame
    );


    obstacles.innerHTML =
        "";

    particles.innerHTML =
        "";


    playerY = 0;

    velocityY = 0;

    score = 0;

    speed =
        START_SPEED;


    distanceSinceSpawn =
        0;

    nextSpawnDistance =
        75;

    firstObstacle =
        true;


    worldScroll = 0;

    runTime = 0;

    jumpTime = 0;

    landingTime = 0;


    scoreEl.textContent =
        "00000";


    player.style.bottom =
        "-15px";


    gameOverScreen.style.display =
        "none";

    startScreen.style.display =
        "flex";


    const button =
        document.getElementById(
            "backHomeBtn"
        );


    if (button) {

        button.style.display =
            "none";

    }


    /* REFRESH HOME BEST */

    const savedBest =
        Number(
            localStorage.getItem(
                "headrun-best"
            ) || 0
        );


    if (homeBestScoreEl) {

        homeBestScoreEl.textContent =
            String(savedBest)
                .padStart(
                    5,
                    "0"
                );

    }


    updateDayNight();

    drawCharacter();

}


/* =========================================================
   BUTTONS
========================================================= */

startBtn.addEventListener(
    "click",
    event => {

        event.stopPropagation();

        startGame();

    }
);


restartBtn.addEventListener(
    "click",
    event => {

        event.stopPropagation();

        startGame();

    }
);


/* =========================================================
   KEYBOARD
========================================================= */

document.addEventListener(
    "keydown",
    event => {

        if (
            event.code === "Space" ||
            event.code === "ArrowUp"
        ) {

            event.preventDefault();


            if (
                !gameRunning &&
                startScreen.style.display !==
                "none"
            ) {

                startGame();

                return;

            }


            jump();

        }


        if (
            event.code === "Escape" &&
            gameRunning
        ) {

            endGame();

        }

    }
);


/* =========================================================
   MOUSE
========================================================= */

game.addEventListener(
    "mousedown",
    event => {

        if (
            event.target.closest("button") ||
            event.target.closest(
                ".character-card"
            )
        ) {

            return;

        }


        jump();

    }
);


/* =========================================================
   TOUCH
========================================================= */

game.addEventListener(
    "touchstart",
    event => {

        if (
            event.target.closest("button") ||
            event.target.closest(
                ".character-card"
            )
        ) {

            return;

        }


        jump();

    },
    {
        passive: true
    }
);


/* =========================================================
   INITIALIZE
========================================================= */

createSkySystem();


face.src =
    characters
        .chunnilal
        .image;


/* LOAD SAVED BEST SCORE */

const savedBest =
    Number(
        localStorage.getItem(
            "headrun-best"
        ) || 0
    );


if (homeBestScoreEl) {

    homeBestScoreEl.textContent =
        String(savedBest)
            .padStart(
                5,
                "0"
            );

}


if (bestScoreEl) {

    bestScoreEl.textContent =
        String(savedBest)
            .padStart(
                5,
                "0"
            );

}


startScreen.style.display =
    "flex";


gameOverScreen.style.display =
    "none";


playerY = 0;


player.style.bottom =
    "-15px";


updateDayNight();

drawCharacter();