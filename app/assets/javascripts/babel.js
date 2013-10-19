var PERSON_SPRITES = {
    'up': [[0, 0], [0, 80]],
    'right': [[40, 0], [40, 80]],
    'down': [[80, 0], [80, 80]],
    'left': [[120, 0], [120, 80]]
}

var DIR_TO_MOTION = {
    'up': [0,-1],
    'right': [1,0],
    'down': [0,1],
    'left': [-1,0]
}


var SPACE = 32;

var LEFT = 37;
var UP = 38;
var RIGHT = 39;
var DOWN = 40;

var STATE_UPDATE_DELAY = 80;
var MOTION_SPEED = 5; // pixels

var curr_dir = 'up'
var curr_state = 0

var curr_x = 200;
var curr_y = 200;

var last_time = new Date();

var box_pos = "p0xp0";
var box_x = 0;
var box_y = 0;

var book_displayed = false;

$(document).ready(function() {
    updatePerson();
    box_pos = $('#data_box').data('pos');
    box_x = $('#data_box').data('x');    
    box_y = $('#data_box').data('y');    
    // history.pushState({}, 'title', '/babel/p0xp1');
});



$(document).keydown(function(e) {

    
    if (e.which == SPACE) {
        e.preventDefault();
        pressSpace();
    } else if(e.which == LEFT || e.which == UP ||
              e.which == RIGHT || e.which == DOWN) {
        e.preventDefault();
        pressArrowKey(e.which);
    }
    
    // alert("Event: " + e);
});

var SCALE = 3;

function updatePerson() {
    $('#person').css('left', curr_x);
    $('#person').css('top', curr_y);
    $('#person').css('height', curr_y/SCALE);
    $('#person').css('width', curr_y/(2*SCALE));
    $('#person').css('background-size', curr_y*(2/SCALE));
    var size = curr_y * 0.8;
    pos = PERSON_SPRITES[curr_dir][curr_state];
    $('#person').css("background-position",
                     pos[0]*curr_y/(80*SCALE) + 'px '
                     + pos[1]*curr_y/(80*SCALE) + 'px');
}

function abs(a) {
    return (a >= 0 ? a : -a);
}

function updateURL() {
    box_pos = (box_x >= 0 ? 'p' : 'n') + abs(box_x) + 'x' + (box_y >= 0 ? 'p' : 'n') + abs(box_y);
    console.log(box_pos);
    history.pushState({}, 'Library of Babel', '/babel/'+box_pos);
}

function checkBorders() {
    if (curr_x >= 390) {
        box_x += 1;
        curr_x = 20;
        updateURL();
    } else if (curr_y >= 380) {
        box_y += 1;
        curr_y = 60;
        updateURL();
    } else if (curr_x <= 10) {
        box_x -= 1;
        curr_x = 360;
        updateURL();
    } else if (curr_y <= 50) {
        box_y -= 1;
        curr_y = 360;
        updateURL();
    }

}

function movePerson(dir) {
    var delta = DIR_TO_MOTION[dir];
    curr_x += delta[0] * MOTION_SPEED * (curr_y / 200.0);
    curr_y += delta[1] * MOTION_SPEED * (curr_y / 200.0);
}

function go(dir) {
    var curr_time = new Date();
    if (curr_dir == dir && (curr_time - last_time) > STATE_UPDATE_DELAY) {
        curr_state += 1;
        curr_state %= 2;
        last_time = curr_time;
    } else if(curr_dir != dir) {
        curr_dir = dir;
        curr_state = 0;
        last_time = curr_time;
    }
    movePerson(dir);
    checkBorders();
    updatePerson();
}

var current_book = ["No book..."];
var current_page = 0;

function pressArrowKey(key) {
    if(book_displayed) {
        switch(key) {
        case LEFT:
            current_page -= 1;
            break;
        case RIGHT:
            current_page += 1;
            break;
        default:
            break;
        }
        $('#text_overlay').html(current_book[current_page]);
    } else {
        switch(key) {
        case LEFT:
            go('left');
            break;
        case RIGHT:
            go('right');
            break;
        case UP:
            go('up');
            break;
        case DOWN:
            go('down');
            break;
        default:
            break;
        }
    }
}

function pressSpace() {
    if(book_displayed) {
        $('#game_box').removeClass("Hidden");
        $('#text_overlay').addClass('Hidden');
        $('#text_overlay').html("");
        book_displayed = false;
    } else {
        var id = -1;
        if(curr_x >= 230 && curr_x <= 230+70 && curr_y >= 80 && curr_y <= 80+89) { 
            //top right
            id = 0;
        } else if(curr_x >= 95 && curr_x <= 95+70 && curr_y >= 80 && curr_y <= 80+89) {
            //top left
            id = 1;
        } else if(curr_x >= 15 && curr_x <= 15+114 && curr_y >= 200 && curr_y <= 200+142) {
            //bottom left
            id = 2;
        } else if(curr_x >= 265 && curr_x <= 265+114 && curr_y >= 200 && curr_y <= 200+142) {
            //bottom right
            id = 3;
        }

        if (id >= 0) {

            $.ajax({
                url: "/text_get/" + box_pos + '/' + id,
                type: "GET",
                datatype: "JSON",
                success: function(data) {
                    current_book = data.text;
                    current_page = 0;
                    $('#text_overlay').html(current_book[0]);
                    $('#text_overlay').removeClass("Hidden");
                    $('#game_box').addClass('Hidden');
                    book_displayed = true;
                }
            });
        }
    }

}
