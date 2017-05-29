// Private variables
const DEFAULT_PRIVATE_VARS = {
    prevX: 0,
    currX: 0,
    prevY: 0,
    currY: 0,
    flag: false
};

const privateVars = new WeakMap();


// Canvas Manager class
export class CanvasManager {
    // Class attributes
    static get MOUSE_EVENT_TYPES() {
        return ['mousemove', 'mousedown', 'mouseup', 'mouseout'];
    }

    static get TOUCH_EVENT_TYPES() {
        return ['touchmove', 'touchstart', 'touchend', ];
    }

    static get DEFAULT_OPTIONS() {
        return {
            instant: false,
            color: 'black',
            size: 2,
        }
    }

    // Constructor
    constructor(canvas, options = {}) {
        // set private variables
        privateVars.set(this, Object.assign({}, DEFAULT_PRIVATE_VARS));

        // set public variables
        Object.assign(this, CanvasManager.DEFAULT_OPTIONS, options, { canvas });

        // bind events
        bindEvents.bind(this)();

    }

    // Setters and Getters
    set canvas(canvas) {
        if (!(canvas && canvas instanceof HTMLElement)) {
            throw TypeError('Canvas must be HTMLElement')
        }
        privateVars.get(this).canvas = canvas;
    }

    get canvas() {
        return privateVars.get(this).canvas;
    }


    get context() {
        return canvas.getContext('2d');
    }

    get width() {
        return canvas.width;
    }

    get height() {
        return canvas.height;
    }

    // Instance Methods
    clear() {
        this.context.clearRect(0, 0, this.width, this.height);
    }

    load(dataUrl) {
        if (dataUrl) {
            const image = new Image();
            image.onload = () => {
                this.context.drawImage(image, 0, 0);
            }
            image.src = dataUrl;
        }
    }
}

// Private functions
function bindEvents() {
    const _findxy = findxy.bind(this);
    CanvasManager.MOUSE_EVENT_TYPES.forEach(eventType => {
        this.canvas.addEventListener(eventType, event => _findxy(event), false);
    });

    const _findTouchxy = findTouchxy.bind(this);
    CanvasManager.TOUCH_EVENT_TYPES.forEach(eventType => {
        this.canvas.addEventListener(eventType, event => _findTouchxy(event), false);
    });

}

function findxy(event) {
    const type = event.type;
    if (type == 'mousedown') {

        calculatePath.bind(this)(event);
        privateVars.get(this).flag = true;

        this.context.beginPath();
        this.context.fillStyle = this.color;
        this.context.fillRect(this.currX, this.currY, 2, 2);
        this.context.closePath();
        return;
    }
    if (type == 'mouseup' || type == "mouseout") {
        if (privateVars.get(this).flag) {
            this.callback && this.callback();
        }
        privateVars.get(this).flag = false;
        return;
    }
    if (type == 'mousemove') {
        if (privateVars.get(this).flag) {
            calculatePath.bind(this)(event);
            draw.bind(this)();
            this.instant && this.callback && this.callback();
        }
    }
}


function findTouchxy(event) {
    const type = event.type;
    const touch = event.touches[0];
    if (type == 'touchstart') {
        const mouseEvent = new MouseEvent("mousedown", {
            clientX: touch.clientX,
            clientY: touch.clientY
        });
        this.canvas.dispatchEvent(mouseEvent);
        return;
    }
    if (type == 'touchend') {
        const mouseEvent = new MouseEvent("mouseup", {});
        this.canvas.dispatchEvent(mouseEvent);
        return;
    }
    if (type == 'touchmove') {
        const mouseEvent = new MouseEvent("mousemove", {
            clientX: touch.clientX,
            clientY: touch.clientY
        });
        canvas.dispatchEvent(mouseEvent);
        return;
    }
}

function draw() {
    this.context.beginPath();
    this.context.moveTo(privateVars.get(this).prevX, privateVars.get(this).prevY);
    this.context.lineTo(privateVars.get(this).currX, privateVars.get(this).currY);
    this.context.lineCap = 'round';
    this.context.strokeStyle = this.color;
    this.context.lineWidth = this.size;
    this.context.stroke();
    this.context.closePath();
}

function calculatePath(event) {
    privateVars.get(this).prevX = privateVars.get(this).currX;
    privateVars.get(this).prevY = privateVars.get(this).currY;
    privateVars.get(this).currX = event.clientX - this.canvas.offsetLeft;
    privateVars.get(this).currY = event.clientY - this.canvas.offsetTop;
}