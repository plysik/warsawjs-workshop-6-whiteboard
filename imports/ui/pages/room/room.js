import './room.html';
import './room.css';
import { Meteor } from 'meteor/meteor';
import { FlowRouter } from 'meteor/kadira:flow-router';
import { Rooms } from '/imports/api/rooms/rooms.js';
import { CanvasManager } from '/imports/utils/client/canvas_manager.js'

let canvas_manager = null;
let init = false;
Template.App_room.onCreated(function() {
    init = null;
    Meteor.subscribe('rooms.getById', FlowRouter.getParam('id'));
});

Template.App_room.onRendered(function() {
    this.autorun(() => {
        if (!init) {
            const room = Rooms.findOne(FlowRouter.getParam('id'));
            if (room) {
                const canvas = document.querySelector("#canvas");
                // Set canvas dimensions
                canvas_manager = new CanvasManager(canvas, {
                    //instant: true,
                    callback: () => {
                        Meteor.call('rooms.updateDataUrl', room._id, canvas.toDataURL());
                    }
                });
                canvas_manager.load(room.dataUrl);

                init = true;
                var sizer = document.createElement("span");
                sizer.setAttribute("id", "sizer");
                sizer.style.width = 20 + "px";
                sizer.style.height = 20 + "px";
                document.body.appendChild(sizer);
                document.addEventListener("mousemove", function() {
                    let posX = event.clientX;
                    let posY = event.clientY;
                    if ((posX >= canvas.offsetLeft && posX <= (canvas.offsetLeft + canvas.width)) && (posY >= canvas.offsetTop && posY <= (canvas.offsetTop + canvas.height))) {
                        if (!sizer.classList.contains("visible")) {
                            sizer.classList.add("visible");
                        }
                        let newPosX = (posX - (parseInt(sizer.style.width) / 2));
                        let newPosY = (posY - (parseInt(sizer.style.height) / 2));
                        sizer.style.left = newPosX + "px";
                        sizer.style.top = newPosY + "px";
                    } else {
                        sizer.classList.remove("visible");
                    }
                });
            }
        }
    });
});

Template.App_room.helpers({
    room() {
        const room = Rooms.findOne(FlowRouter.getParam('id'));
        if (room && canvas_manager) {
            if (room.dataUrl) {
                canvas_manager.load(room.dataUrl);
            } else {
                canvas_manager.clear();
            }
        }
        return Rooms.findOne(FlowRouter.getParam('id'));
    },
    colors() {
        return ['red', 'blue', 'yellow', 'green'];
    },
});

Template.App_room.events({
    'change input[type="radio"]' (e) {
        e.preventDefault();
        if (canvas_manager) {
            const color = $(e.target).val();
            canvas_manager.color = color;
        }
    },
    'change #rngSize' (e) {
        e.preventDefault();
        let size = $(e.target).val();
        $("#tbSize").val(size);
        if (canvas_manager) {
            canvas_manager.size = parseInt(size);
        }
    },
    'change #tbSize' (e) {
        e.preventDefault();
        let size = $(e.target).val();
        $("#rngSize").val(size);
        if (canvas_manager) {
            canvas_manager.size = parseInt(size);
        }
    },
    'click #btnClear' (e) {
        e.preventDefault();
        if (confirm("Czy na pewno chcesz wszystko usunąć?")) {
            const room = Rooms.findOne(FlowRouter.getParam('id'));
            if (room && canvas_manager) {
                canvas_manager.clear();
                Meteor.call('rooms.updateDataUrl', room._id, null);
            }
        }
    }
})