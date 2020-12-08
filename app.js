

let VerletPhysics2D = toxi.physics2d.VerletPhysics2D,
    GravityBehavior = toxi.physics2d.behaviors.GravityBehavior,
    AttractionBehavior = toxi.physics2d.behaviors.AttractionBehavior,
    VerletParticle2D = toxi.physics2d.VerletParticle2D,
    VerletSpring2D = toxi.physics2d.VerletSpring2D,
    VerletMinDistanceSpring2D = toxi.physics2d.VerletMinDistanceSpring2D,
    Vec2D = toxi.geom.Vec2D,
    Rect = toxi.geom.Rect;

let physics;
let dancer;

function setup() {
    createCanvas(windowWidth, windowHeight);
    physics = new VerletPhysics2D();
    physics.addBehavior(new GravityBehavior(new Vec2D(0, 0.5)));

    physics.setWorldBounds(new Rect(0, 0, width, height));

    dancer = new Skeleton(width / 2, height / 2 - 150);
}

function draw() {
    background(0);
    dancer.display();
    dancer.dance();
    physics.update();
}

function Particle(loc, r_) {
    this.p = new VerletParticle2D(loc);
    this.r = r_;
}

Particle.prototype.display = function () {
    fill(0, 100, 255); // color of joints
    stroke(220, 0, 70); // color of outer covering
    strokeWeight(15); // width of outer covering
    // Elliptical object
    ellipse(this.p.x, this.p.y, this.r * 2, this.r * 2);
}

Particle.prototype.lock = function () {
    this.p.lock();
}

Particle.prototype.unlock = function () {
    this.p.unlock();
}

function Skeleton(x, y) {
    this.parts = []; // array of body parts
    this.springs = []; // array of joints

    this.origin = new Vec2D(x, y); // new Vector

    // Positioning the joints
    this.parts.push(new Particle(new Vec2D(x, y), 30));
    this.parts.push(new Particle(new Vec2D(x, y), 4));

    this.parts.push(new Particle(new Vec2D(x + 20, y + 80), 4));
    this.parts.push(new Particle(new Vec2D(x - 20, y + 80), 4));

    this.parts.push(new Particle(new Vec2D(x + 100, y + 80), 4));
    this.parts.push(new Particle(new Vec2D(x - 100, y + 80), 4));

    this.parts.push(new Particle(new Vec2D(x + 200, y + 80), 8));
    this.parts.push(new Particle(new Vec2D(x - 200, y + 80), 8));

    this.parts.push(new Particle(new Vec2D(x, y + 120), 4));

    this.parts.push(new Particle(new Vec2D(x + 50, y + 230), 4));
    this.parts.push(new Particle(new Vec2D(x + 50, y + 230), 4));

    this.parts.push(new Particle(new Vec2D(x + 50, y + 280), 18));
    this.parts.push(new Particle(new Vec2D(x + 50, y + 280), 18));

    this.parts[0].p.lock();

    // Head
    this.springs.push(new VerletSpring2D(this.parts[0].p, this.parts[1].p, 5, 0.01));

    // Arms
    this.springs.push(new VerletSpring2D(this.parts[1].p, this.parts[2].p, 20, 0.01));
    this.springs.push(new VerletSpring2D(this.parts[1].p, this.parts[3].p, 20, 0.01));

    // Elbows
    this.springs.push(new VerletSpring2D(this.parts[2].p, this.parts[4].p, 40, 0.01));
    this.springs.push(new VerletSpring2D(this.parts[3].p, this.parts[5].p, 40, 0.01));

    // Shoulder Length
    physics.addSpring(new VerletMinDistanceSpring2D(this.parts[3].p, this.parts[2].p, 100, 0.01));

    // Fists
    this.springs.push(new VerletSpring2D(this.parts[6].p, this.parts[4].p, 40, 0.01));
    this.springs.push(new VerletSpring2D(this.parts[7].p, this.parts[5].p, 40, 0.01));

    // Chest
    this.springs.push(new VerletSpring2D(this.parts[1].p, this.parts[8].p, 50, 0.01));

    physics.addSpring(new VerletMinDistanceSpring2D(this.parts[8].p, this.parts[2].p, 100, 0.01));
    physics.addSpring(new VerletMinDistanceSpring2D(this.parts[8].p, this.parts[3].p, 100, 0.01));

    physics.addSpring(new VerletMinDistanceSpring2D(this.parts[0].p, this.parts[2].p, 100, 0.01));
    physics.addSpring(new VerletMinDistanceSpring2D(this.parts[0].p, this.parts[3].p, 100, 0.01));

    // Legs
    this.springs.push(new VerletSpring2D(this.parts[8].p, this.parts[10].p, 80, 0.01));
    this.springs.push(new VerletSpring2D(this.parts[8].p, this.parts[9].p, 80, 0.01));

    physics.addSpring(new VerletMinDistanceSpring2D(this.parts[10].p, this.parts[9].p, 50, 0.01));

    // Toes
    this.springs.push(new VerletSpring2D(this.parts[12].p, this.parts[10].p, 80, 0.01));
    this.springs.push(new VerletSpring2D(this.parts[11].p, this.parts[9].p, 80, 0.01));

    // particle motion
    for (var i = 0; i < this.parts.length; i++) {
        var p = this.parts[i];
        physics.addParticle(p.p);
    }

    // move body
    for (var i = 0; i < this.springs.length; i++) {
        var s = this.springs[i];
        physics.addSpring(s);
    }

    this.hangle = 0; // horizontal angle
    this.vangle = 0; // vertical angle
}

// Dance
Skeleton.prototype.dance = function () {
    this.parts[0].p.x = this.origin.x + sin(this.hangle) * 10;
    this.parts[0].p.y = this.origin.y + cos(this.vangle) * 10;

    this.hangle += 0.3;
    this.vangle += 0.2;
}

Skeleton.prototype.display = function () {
    // display joints
    for (var i = 0; i < this.springs.length; i++) {
        var s = this.springs[i];
        stroke(255);
        strokeWeight(10);
        line(s.a.x, s.a.y, s.b.x, s.b.y);
    }

    // display body 
    for (var i = 0; i < this.parts.length; i++) {
        var p = this.parts[i];
        p.display();
    }
}