var userName
var COLORS = [
  '#e21400', '#91580f', '#f8a700', '#f78b00',
  '#58dc00', '#287b00', '#a8f07a', '#4ae8c4',
  '#3b88eb', '#3824aa', '#a700ff', '#d300e7'
]
// Gets the color of a username through our hash function
function getUsernameColor (username) {
  // Compute hash code
  var hash = 7;
  for (var i = 0; i < username.length; i++) {
     hash = username.charCodeAt(i) + (hash << 5) - hash;
  }
  // Calculate color
  var index = Math.abs(hash % COLORS.length);
  return COLORS[index];
}

function getName() {
    var name = window.localStorage.getItem('userName')
    return name
}

function setName(name) {
    var name = window.localStorage.setItem('userName', name)
}

function checkName(fun) {
    var a = getName()
    if (a) {
        userName = a
        $('#myModal').hide()
        fun()
    } else {
        $('#myModal').show()
    }
}

$(function() {


    function fun() {
        socket.emit('login', userName)
    }
    $getName = $('#getName')
    $name = $('#name')
    $numbers = $('#numbers')
    $infoContainer = $('#infoContainer')
    $contentBox = $('#contentBox')
    var isOver = false

    $contentBox.on('mouseenter', function() {
        isOver = true
    })

    $contentBox.on('mouseleave', function() {
        isOver = false
    })

    $getName.click(function() {
        if(!$name.val()) {
            return false
        }
        setName($name.val())
        checkName(fun)
    })


    var socket = io()
    socket.on('chat message', function(msg) {
         $('#messages').append(
             $('<li>').append(
                 $('<p>').text(msg.userName+': ').css('color', getUsernameColor(msg.userName)).append($('<span>').text(msg.time)),
                 $('<p>').text(msg.msg)
             )
         )
         if(!isOver){
             $contentBox.animate({scrollTop:$('#messages').height() > 450 ? $('#messages').height()-400 : 0}, 300)
         }
    })

    socket.on('addUser', function(msg) {
        $numbers.text(msg.numbers)
    })

    socket.on('userLeave', function(msg) {
        $numbers.text(msg.numbers)
    })

    socket.on('login ok', function(msg) {
        $numbers.text(msg)
    })



    var $m = $('#m')
    var $send = $('#send')
    $send.on('submit', function(){
        if(!$m.val()) return false

        socket.emit('chat message', $m.val())
        $contentBox.animate({scrollTop:$('#messages').height() > 450 ? $('#messages').height()-400 : 0}, 300)
        $m.val('')
        return false
    })

    function log(info, type) {
        var $p = $('<p>').animate({bottom:"100px",opacity: 0}, 1000, 'linear', function() {
            $p.remove()
        })

        switch(type) {
            case 'login':
                $p.addClass('login-in').text('用户'+info+'加入房间。')
            break;
            case 'logout':
                $p.addClass('login-out').text('用户'+info+'离开房间。')
            break;
        }

        $infoContainer.append($p)
    }

    checkName(fun)
})
