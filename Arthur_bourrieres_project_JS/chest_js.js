/*met en place le canvas et le context*/
var canvas = document.getElementById("game");
var ctx = canvas.getContext("2d");

/**definie plusieur variable utiliser pour le fonctionnement du code */
var chess_board = []; //defenie la liste qui represente le plateau d'echec
var size_case_board = 100; //definie la taille des case du jeux d'echec
var selection = false; //permet de savoir à quelle moment une piece est sélectionné
var actual_mouse_pos; //permet d'enregistrer la position de la souris a un moment donné
var nombre_tour_jouer = 1;

//ajuste le canvas à la taille du plateau
canvas.width = size_case_board * 8;
canvas.height = size_case_board * 8;
canvas.style.width = size_case_board * 8;
canvas.style.height = size_case_board * 8;

var rect = canvas.getBoundingClientRect();

/**crée une liste en 2 dimension nomer "chest_board" pour représenter l'echiquier
 *
 * le tableau est composé de 8 ligne et 8 colonne
 */
function creat_ches_board() {
  for (let i = 0; i < 8; i++) {
    var ligne = [];
    for (let a = 0; a < 8; a++) {
      ligne.push(false);
    }
    chess_board.push(ligne);
  }
}

/**permet d'afficher l'echiquier
 *
 * le tableau est composer de case de 2 couleur différente qui s'alterne l'une apres l'autre de
 * façon que 2 case de même couleur ne soit jamais à côtè.
 */
function draw_ches_board() {
  let conteur_case = 1; //conteur permettant de savoir de quelle couleur est la case
  let conteur_line = 0; //conteur permettant de savoir quelle sera l'alternance de couleur dans la ligne
  for (let i = 0; i < chess_board.length; i++) {
    for (let a = 0; a < chess_board[i].length; a++) {
      if (conteur_case % 2 == 0 && conteur_line % 2 == 0) {
        ctx.fillStyle = "rgb(250,221,144)";
        ctx.fillRect(
          a * size_case_board,
          i * size_case_board,
          size_case_board,
          size_case_board
        );
      }

      if (conteur_case % 2 != 0 && conteur_line % 2 == 0) {
        ctx.fillStyle = "rgb(167, 110, 55)";
        ctx.fillRect(
          a * size_case_board,
          i * size_case_board,
          size_case_board,
          size_case_board
        );
      }

      if (conteur_case % 2 != 0 && conteur_line % 2 != 0) {
        ctx.fillStyle = "rgb(250,221,144)";
        ctx.fillRect(
          a * size_case_board,
          i * size_case_board,
          size_case_board,
          size_case_board
        );
      }

      if (conteur_case % 2 == 0 && conteur_line % 2 != 0) {
        ctx.fillStyle = "rgb(167, 110, 55)";
        ctx.fillRect(
          a * size_case_board,
          i * size_case_board,
          size_case_board,
          size_case_board
        );
      }

      conteur_case++;
    }
    conteur_line++;
  }
}
/**permet de promouvoir un pion quand il arrive au bout de l'echiquier  */
function promotion(pos_x, pos_y) {
  if (
    chess_board[pos_y][pos_x].type == "pawn" &&
    chess_board[pos_y][pos_x].color == 0 &&
    chess_board[pos_y][pos_x].y == 7
  ) {
    chess_board[pos_y][pos_x].type = "queen";
    chess_board[pos_y][pos_x].img.src = "white_queen.png";
  }
  if (
    chess_board[pos_y][pos_x].type == "pawn" &&
    chess_board[pos_y][pos_x].color == 1 &&
    chess_board[pos_y][pos_x].y == 0
  ) {
    chess_board[pos_y][pos_x].type = "queen";
    chess_board[pos_y][pos_x].img.src = "black_queen.png";
  }
}

/** object permettant de definir les differents pieces
 *
 * il permet de définir les différentes specifisiter de l'object qui sont:
 * sa position: x, y dans le plateau de jeu
 * son type: pion, roi, rein...
 * sa couleur: blanc ou noir
 * mais aussi sont image qui sera afficher sur le plateau et si la piece a deja bouger dans la partie
 */
class Piece {
  constructor(x, y, type, color) {
    this.x = x; //coordonné x dans le plateau
    this.y = y; //coordonné y dans le plateau
    this.type = type; //type de piéce
    this.color = color; //couleur de la piece
    this.first_moov = true; //permet de savoir si la piece a déjà était jouer
    this.selectionner = true; //permet de savoir si la piece est selectionée
    this.img = new Image();

    /**permet d'attribuer l'image de la piéce à partir de sa couleur et de son type */
    if (color == 1) {
      switch (this.type) {
        case "pawn":
          this.img.src = "black_pawn.png";
          break;
        case "rook":
          this.img.src = "black_rook.png";
          break;
        case "knight":
          this.img.src = "black_knight.png";
          break;
        case "bishops":
          this.img.src = "black_bishops.png";
          break;
        case "queen":
          this.img.src = "black_queen.png";
          break;
        case "king":
          this.img.src = "black_king.png";
          break;
      }
    }

    if (color == 0) {
      switch (this.type) {
        case "pawn":
          this.img.src = "white_pawn.png";
          break;
        case "rook":
          this.img.src = "white_rook.png";
          break;
        case "knight":
          this.img.src = "white_knight.png";
          break;
        case "bishops":
          this.img.src = "white_bishops.png";
          break;
        case "queen":
          this.img.src = "white_queen.png";
          break;
        case "king":
          this.img.src = "white_king.png";
          break;
      }
    }
  }
  /**permet de changer la couleur de la piéce quand elle est selectionné, et de de la faire de nouveau changer de couleur quand elle ne l'est plus  */
  selection() {
    if (this.selectionner) {
      switch (this.type) {
        case "pawn":
          this.img.src = "green_pawn.png";
          break;
        case "rook":
          this.img.src = "green_rook.png";
          break;
        case "knight":
          this.img.src = "green_knight.png";
          break;
        case "bishops":
          this.img.src = "green_bishops.png";
          break;
        case "queen":
          this.img.src = "green_queen.png";
          break;
        case "king":
          this.img.src = "green_king.png";
          break;
      }
    } else if (this.color == 0) {
      switch (this.type) {
        case "pawn":
          this.img.src = "white_pawn.png";
          break;
        case "rook":
          this.img.src = "white_rook.png";
          break;
        case "knight":
          this.img.src = "white_knight.png";
          break;
        case "bishops":
          this.img.src = "white_bishops.png";
          break;
        case "queen":
          this.img.src = "white_queen.png";
          break;
        case "king":
          this.img.src = "white_king.png";
          break;
      }
    } else if (this.color == 1) {
      switch (this.type) {
        case "pawn":
          this.img.src = "black_pawn.png";
          break;
        case "rook":
          this.img.src = "black_rook.png";
          break;
        case "knight":
          this.img.src = "black_knight.png";
          break;
        case "bishops":
          this.img.src = "black_bishops.png";
          break;
        case "queen":
          this.img.src = "black_queen.png";
          break;
        case "king":
          this.img.src = "black_king.png";
          break;
      }
    }
  }

  /**renvoie la position x dans le canvas */
  getPos_x() {
    return this.x * size_case_board;
  }
  /**renvoie la position y dans le canvas */
  getPos_y() {
    return this.y * size_case_board;
  }

  /**permet d'afficher l'image dans le canvas */
  plot() {
    ctx.drawImage(
      this.img,
      this.getPos_x(),
      this.getPos_y(),
      size_case_board,
      size_case_board
    );
  }

  /**renvoie la listes des position autorisé pour la piéce selectionné */
  pos_permision() {
    switch (this.type) {
      case "pawn":
        return this.pawn_permision();
        break;
      case "knight":
        return this.knight_permision();
      case "king":
        return this.king_permision();
      case "bishops":
        return this.bishops_permision();
      case "rook":
        return this.rook_permision();
      case "queen":
        return this.queen_permision();
    }
  }

  /**
   * retoune la liste des position autorisé pour les pions
   * mouvement pion:
   * un pion peut se deplacer uniquement d'une case vers l'avent
   * quand il est jouer pour la premier foie il peut avencer de 2 case vers l'avent
   * il prend les pieces en diagonal à sa gauche ou à sa droit
   */
  pawn_permision() {
    switch (
      this.color // permet de savoir quelle est la couleur du pion est donc la direction dans la quelle il vas
    ) {
      case 0:
        var position_autoriser = [];

        if (chess_board[this.y + 1][this.x].color != 1) {
          //enpeche le pion d'avencer si une piece est en face
          if (this.first_moov) {
            // definie les position autoriser au premier coup
            for (let i = 1; i < 3; i++) {
              if (chess_board[this.y + i][this.x].color == this.color) {
                break;
              } else {
                let a = [this.x, this.y + i];
                position_autoriser.push(a);
              }
            }
          } else {
            //si le premier coup du pion a déjà était jouer
            let a = [this.x, this.y + 1];
            position_autoriser.push(a);
          }
        }

        if (this.x + 1 <= 7) {
          //permet de savoir si le pion peut prendre sur le cote
          if (chess_board[this.y + 1][this.x + 1].color == 1) {
            let a = [this.x + 1, this.y + 1];
            position_autoriser.push(a);
          }
        }
        if (this.x - 1 >= 0) {
          //permet de savoir si le pion peut prendre sur le cote
          if (chess_board[this.y + 1][this.x - 1].color == 1) {
            let a = [this.x - 1, this.y + 1];
            position_autoriser.push(a);
          }
        }
        console.log(position_autoriser);
        return position_autoriser;

      case 1: //même pricipe mais pour les pions de l'autre couleur
        var position_autoriser = [];

        if (chess_board[this.y - 1][this.x].color != 0) {
          if (this.first_moov) {
            for (let i = 1; i < 3; i++) {
              if (chess_board[this.y - i][this.x].color == this.color) {
                break;
              } else {
                let a = [this.x, this.y - i];
                position_autoriser.push(a);
              }
            }
          } else {
            let a = [this.x, this.y - 1];
            position_autoriser.push(a);
          }
        }

        if (this.x + 1 <= 7) {
          if (chess_board[this.y - 1][this.x + 1].color == 0) {
            let a = [this.x + 1, this.y - 1];
            position_autoriser.push(a);
          }
        }

        if (this.x - 1 >= 0) {
          if (chess_board[this.y - 1][this.x - 1].color == 0) {
            let a = [this.x - 1, this.y - 1];
            position_autoriser.push(a);
          }
        }
        console.log(position_autoriser);
        return position_autoriser;
    }
  }

  /**
   * retourne la liste des positions autorisé pour le cavalier
   * mouvement cavalier:
   * le cavalier se deplace toujours de 2 case dans une direction et une dans l'autre
   */
  knight_permision() {
    let position_autoriser = [
      [this.x + 2, this.y + 1],
      [this.x + 2, this.y - 1],
      [this.x - 2, this.y - 1],
      [this.x - 2, this.y + 1],
      [this.x + 1, this.y + 2],
      [this.x - 1, this.y + 2],
      [this.x + 1, this.y - 2],
      [this.x - 1, this.y - 2],
    ];
    return position_autoriser;
  }

  /**retoune la liste des positions autorisé pour le roi
   * mouvement roi:
   * se deplace d'une case dans n'importe quelle diréction
   */
  king_permision() {
    let position_autoriser = [
      [this.x + 1, this.y + 1],
      [this.x + 1, this.y - 1],
      [this.x - 1, this.y - 1],
      [this.x - 1, this.y + 1],
      [this.x + 1, this.y],
      [this.x - 1, this.y],
      [this.x, this.y + 1],
      [this.x, this.y - 1],
    ];
    return position_autoriser;
  }

  /**retourne la liste des poisitions pour autorisé pour le fou
   * mouvement fou:
   * se deplace en diagonal d'autant de case qu'il le souhaite
   *
   * chaque boucle de la fonction correspond à une direction ou peut aller le fou
   */
  bishops_permision() {
    let position_autoriser = [];

    for (let i = 1; i <= 7; i++) {
      if (this.x + i <= 7 && this.y + i <= 7) {
        if (chess_board[this.y + i][this.x + i] != false) {
          //verifie qu'il n'est pas de piece sur le chemin
          let a = [this.x + i, this.y + i];
          position_autoriser.push(a);
          break;
        } else {
          let a = [this.x + i, this.y + i];
          position_autoriser.push(a);
        }
      }
    }

    for (let i = 1; i <= 7; i++) {
      if (this.x - i >= 0 && this.y - i >= 0) {
        if (chess_board[this.y - i][this.x - i] != false) {
          let a = [this.x - i, this.y - i];
          position_autoriser.push(a);
          break;
        } else {
          let a = [this.x - i, this.y - i];
          position_autoriser.push(a);
        }
      }
    }

    for (let i = 1; i <= 7; i++) {
      console.log("cc");
      if (this.x + i <= 7 && this.y - i >= 0) {
        if (chess_board[this.y - i][this.x + i] != false) {
          let a = [this.x + i, this.y - i];
          position_autoriser.push(a);
          break;
        } else {
          let a = [this.x + i, this.y - i];
          position_autoriser.push(a);
        }
      }
    }

    for (let i = 1; i <= 7; i++) {
      if (this.x - i >= 0 && this.y + i <= 7) {
        if (chess_board[this.y + i][this.x - i] != false) {
          let a = [this.x - i, this.y + i];
          position_autoriser.push(a);
          break;
        } else {
          let a = [this.x - i, this.y + i];
          position_autoriser.push(a);
        }
      }
    }

    return position_autoriser;
  }

  /**retourne la lise des positions de autorisé pour la tour
   * mouvement tour:
   * se deplace en ligne droite d'autant de case qu'il veut
   *
   * chaque boucle de la fonction correspond à une direction ou peut aller la tour
   */
  rook_permision() {
    let position_autoriser = [];

    for (let i = 1; i <= 7; i++) {
      if (this.x + i <= 7 && this.y <= 7) {
        if (chess_board[this.y][this.x + i] != false) {
          let a = [this.x + i, this.y];
          position_autoriser.push(a);
          break;
        } else {
          let a = [this.x + i, this.y];
          position_autoriser.push(a);
        }
      }
    }

    for (let i = 1; i <= 7; i++) {
      if (this.x - i >= 0 && this.y >= 0) {
        if (chess_board[this.y][this.x - i] != false) {
          let a = [this.x - i, this.y];
          position_autoriser.push(a);
          break;
        } else {
          let a = [this.x - i, this.y];
          position_autoriser.push(a);
        }
      }
    }

    for (let i = 1; i <= 7; i++) {
      console.log("cc");
      if (this.x <= 7 && this.y - i >= 0) {
        if (chess_board[this.y - i][this.x] != false) {
          let a = [this.x, this.y - i];
          position_autoriser.push(a);
          break;
        } else {
          let a = [this.x, this.y - i];
          position_autoriser.push(a);
        }
      }
    }

    for (let i = 1; i <= 7; i++) {
      if (this.x >= 0 && this.y + i <= 7) {
        if (chess_board[this.y + i][this.x] != false) {
          let a = [this.x, this.y + i];
          position_autoriser.push(a);
          break;
        } else {
          let a = [this.x, this.y + i];
          position_autoriser.push(a);
        }
      }
    }

    return position_autoriser;
  }

  /**retourne la lise des positions de autorisé pour la reinne
   * mouvement tour:
   * se deplace dans toute les directions d'autant de case qu'elle le veut
   *
   * chaque boucle de la fonction correspond à une direction ou peut aller la reinne
   */
  queen_permision() {
    let position_autoriser = [];

    for (let i = 1; i <= 7; i++) {
      if (this.x + i <= 7 && this.y <= 7) {
        if (chess_board[this.y][this.x + i] != false) {
          let a = [this.x + i, this.y];
          position_autoriser.push(a);
          break;
        } else {
          let a = [this.x + i, this.y];
          position_autoriser.push(a);
        }
      }
    }

    for (let i = 1; i <= 7; i++) {
      if (this.x - i >= 0 && this.y >= 0) {
        if (chess_board[this.y][this.x - i] != false) {
          let a = [this.x - i, this.y];
          position_autoriser.push(a);
          break;
        } else {
          let a = [this.x - i, this.y];
          position_autoriser.push(a);
        }
      }
    }

    for (let i = 1; i <= 7; i++) {
      console.log("cc");
      if (this.x <= 7 && this.y - i >= 0) {
        if (chess_board[this.y - i][this.x] != false) {
          let a = [this.x, this.y - i];
          position_autoriser.push(a);
          break;
        } else {
          let a = [this.x, this.y - i];
          position_autoriser.push(a);
        }
      }
    }

    for (let i = 1; i <= 7; i++) {
      if (this.x >= 0 && this.y + i <= 7) {
        if (chess_board[this.y + i][this.x] != false) {
          let a = [this.x, this.y + i];
          position_autoriser.push(a);
          break;
        } else {
          let a = [this.x, this.y + i];
          position_autoriser.push(a);
        }
      }
    }

    for (let i = 1; i <= 7; i++) {
      if (this.x + i <= 7 && this.y + i <= 7) {
        if (chess_board[this.y + i][this.x + i] != false) {
          let a = [this.x + i, this.y + i];
          position_autoriser.push(a);
          break;
        } else {
          let a = [this.x + i, this.y + i];
          position_autoriser.push(a);
        }
      }
    }

    for (let i = 1; i <= 7; i++) {
      if (this.x - i >= 0 && this.y - i >= 0) {
        if (chess_board[this.y - i][this.x - i] != false) {
          let a = [this.x - i, this.y - i];
          position_autoriser.push(a);
          break;
        } else {
          let a = [this.x - i, this.y - i];
          position_autoriser.push(a);
        }
      }
    }

    for (let i = 1; i <= 7; i++) {
      console.log("cc");
      if (this.x + i <= 7 && this.y - i >= 0) {
        if (chess_board[this.y - i][this.x + i] != false) {
          let a = [this.x + i, this.y - i];
          position_autoriser.push(a);
          break;
        } else {
          let a = [this.x + i, this.y - i];
          position_autoriser.push(a);
        }
      }
    }

    for (let i = 1; i <= 7; i++) {
      if (this.x - i >= 0 && this.y + i <= 7) {
        if (chess_board[this.y + i][this.x - i] != false) {
          let a = [this.x - i, this.y + i];
          position_autoriser.push(a);
          break;
        } else {
          let a = [this.x - i, this.y + i];
          position_autoriser.push(a);
        }
      }
    }

    return position_autoriser;
  }
}

/**permet d'afficher chaque piece du plateau  */
function plot_piece() {
  for (let i in chess_board) {
    for (let a in chess_board[i]) {
      if (chess_board[i][a] != false) {
        chess_board[i][a].plot();
      }
    }
  }
}

creat_ches_board(); // crée le plateau

/* cree les piece et les place sur le plateau */
chess_board[0][0] = new Piece(0, 0, "rook", 0);
chess_board[0][7] = new Piece(7, 0, "rook", 0);
chess_board[7][0] = new Piece(0, 7, "rook", 1);
chess_board[7][7] = new Piece(7, 7, "rook", 1);
chess_board[0][1] = new Piece(1, 0, "knight", 0);
chess_board[0][6] = new Piece(6, 0, "knight", 0);
chess_board[7][1] = new Piece(1, 7, "knight", 1);
chess_board[7][6] = new Piece(6, 7, "knight", 1);
chess_board[0][2] = new Piece(2, 0, "bishops", 0);
chess_board[0][5] = new Piece(5, 0, "bishops", 0);
chess_board[7][2] = new Piece(2, 7, "bishops", 1);
chess_board[7][5] = new Piece(5, 7, "bishops", 1);
chess_board[0][3] = new Piece(3, 0, "queen", 0);
chess_board[7][3] = new Piece(3, 7, "queen", 1);
chess_board[0][4] = new Piece(4, 0, "king", 0);
chess_board[7][4] = new Piece(4, 7, "king", 1);
chess_board[1][0] = new Piece(0, 1, "pawn", 0);
chess_board[1][1] = new Piece(1, 1, "pawn", 0);
chess_board[1][2] = new Piece(2, 1, "pawn", 0);
chess_board[1][3] = new Piece(3, 1, "pawn", 0);
chess_board[1][4] = new Piece(4, 1, "pawn", 0);
chess_board[1][5] = new Piece(5, 1, "pawn", 0);
chess_board[1][6] = new Piece(6, 1, "pawn", 0);
chess_board[1][7] = new Piece(7, 1, "pawn", 0);
chess_board[6][0] = new Piece(0, 6, "pawn", 1);
chess_board[6][1] = new Piece(1, 6, "pawn", 1);
chess_board[6][2] = new Piece(2, 6, "pawn", 1);
chess_board[6][3] = new Piece(3, 6, "pawn", 1);
chess_board[6][4] = new Piece(4, 6, "pawn", 1);
chess_board[6][5] = new Piece(5, 6, "pawn", 1);
chess_board[6][6] = new Piece(6, 6, "pawn", 1);
chess_board[6][7] = new Piece(7, 6, "pawn", 1);

function indique_player_turne() {
  if (nombre_tour_jouer % 2 == 1) {
    let tour = document.getElementById("tour");
    tour.innerHTML = "tour joueur blanc";
    tour.style.color = "white";
  } else {
    let tour = document.getElementById("tour");
    tour.innerHTML = "tour joueur noir";
    tour.style.color = "black";
  }
}

/**permet de savoir à quelle joueur c'est le tour  */
function player_turne() {
  if (nombre_tour_jouer % 2 == 1) {
    return 0;
  } else {
    return 1;
  }
}

/**fonction s'éxecutant à chaque foi que le bouton de la souris
 * elle gére la selection des pieces et des leur deplacement
 */
addEventListener("click", function (event) {
  let reel_pos_x = event.clientX - rect.left;
  let reel_pos_y = event.clientY - rect.top;
  //verifie que le joueur click bien dans le plateau
  if (
    reel_pos_x < 8 * size_case_board &&
    reel_pos_x &&
    reel_pos_y < 8 * size_case_board &&
    reel_pos_y > 0
  ) {
    let pos_x = Math.floor(reel_pos_x / size_case_board); // recupére la position x dans le tableau l'ore du click
    let pos_y = Math.floor(reel_pos_y / size_case_board); // recupére la position y dans le tableau l'ore du click

    if (chess_board[pos_y][pos_x] != false && selection == false) {
      if (chess_board[pos_y][pos_x].color == player_turne()) {
        // si aucune piece n'est selectionné et qu'une piéce est cliquer, enregistre sa position, et indique qu'une piece est selectionner
        actual_pos = [pos_x, pos_y];
        chess_board[pos_y][pos_x].selectionner = true;
        chess_board[pos_y][pos_x].selection();
        selection = true;
        console.log("selection");
      }
    } else if (
      selection &&
      chess_board[actual_pos[1]][actual_pos[0]].color ==
        chess_board[pos_y][pos_x].color &&
      chess_board[actual_pos[1]][actual_pos[0]] != chess_board[pos_y][pos_x]
    ) {
      //si une piece de la même couleur est cliquer la selectionne à la place
      chess_board[pos_y][pos_x].selectionner = true;
      chess_board[actual_pos[1]][actual_pos[0]].selectionner = false;
      chess_board[pos_y][pos_x].selection();
      chess_board[actual_pos[1]][actual_pos[0]].selection();
      actual_pos = [pos_x, pos_y];
      console.log("change selection");
    } else if (selection) {
      let autor = false; //permet de savoir si la piece est autorisé a bouger sur la case choicie
      let list_autor =
        chess_board[actual_pos[1]][actual_pos[0]].pos_permision(); //definie les case autoricé pour la piéce séléctionner
      //verifie que la case sélectionner fait partie des position autoriser
      for (let i = 0; i <= list_autor.length - 1; i++) {
        if (pos_x == list_autor[i][0] && list_autor[i][1] == pos_y) {
          autor = true;
          console.log(autor);
        }
      }
      console.log("moov piece");
      if (autor) {
        //si la case fait partie des positions autorisées déplace la piece et enléve la selection
        chess_board[actual_pos[1]][actual_pos[0]].selectionner = false;
        chess_board[actual_pos[1]][actual_pos[0]].selection();
        chess_board[actual_pos[1]][actual_pos[0]].first_moov = false;
        chess_board[pos_y][pos_x] = chess_board[actual_pos[1]][actual_pos[0]];
        chess_board[actual_pos[1]][actual_pos[0]].x = pos_x;
        chess_board[actual_pos[1]][actual_pos[0]].y = pos_y;
        chess_board[actual_pos[1]][actual_pos[0]] = false;
        promotion(pos_x, pos_y);
        console.log(selection);
        selection = false;
        nombre_tour_jouer += 1;
      } else {
        //si la case selectionner ne fait pas parie des positions autorisé d'eselectionner la piéce
        chess_board[actual_pos[1]][actual_pos[0]].selectionner = false;
        chess_board[actual_pos[1]][actual_pos[0]].selection();
        actual_pos = [];
        selection = false;
      }
    }
  }
});

animate();

/**boucle principal */
function animate() {
  draw_ches_board();
  indique_player_turne();
  plot_piece();

  requestAnimationFrame(animate);
}
