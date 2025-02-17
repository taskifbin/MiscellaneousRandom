#include <iostream>
using namespace std;

char board[3][3]= {{'1','2','3'},{'4','5','6'},{'7','8','9'}};
char currMarker;
int currPlayer;

void drawBoard(){
    cout<<"------Tic-Tac-Toe Board------\n";
    cout<<" "<<board[0][0]<<"|"<<board[0][1]<<"|"<<board[0][2]<<endl;
    cout<<" "<<board[1][0]<<"|"<<board[1][1]<<"|"<<board[1][2]<<endl;
    cout<<" "<<board[2][0]<<"|"<<board[2][1]<<"|"<<board[2][2]<<endl;
}

bool placeMarker(int slot) {
    int row = (slot - 1) / 3;
    int col = (slot - 1) % 3;

    if (board[row][col] != 'X' && board[row][col] != 'O') {
        board[row][col] = currMarker;
        return true;
    }
    return false;
}

int checkWinner() {
    for (int i = 0; i < 3; i++) {
        if ((board[i][0] == board[i][1] && board[i][1] == board[i][2]) || (board[0][i] == board[1][i] && board[1][i] == board[2][i])) {
            return currPlayer;
        }
    }
    if ((board[0][0] == board[1][1] && board[1][1] == board[2][2]) || (board[0][2] == board[1][1] && board[1][1] == board[2][0])) {
        return currPlayer;
    }
    return 0;
}

void swapPlayer() {
    currMarker = (currMarker == 'X') ? 'O' : 'X';
    currPlayer = (currPlayer == 1) ? 2 : 1;
}

void game() {
    int slot, winner = 0;
    currPlayer = 1;
    currMarker = 'X';

    drawBoard();

    for (int i = 0; i < 9; i++) {
        cout << "Player " << currPlayer << " (" << currMarker << "), enter slot (1-9): ";
        cin >> slot;

        if (slot < 1 || slot > 9 || !placeMarker(slot)) {
            cout << "Invalid move! Try again.\n";
            i--; 
            continue;
        }

        drawBoard();
        winner = checkWinner();
        if (winner) break;
        swapPlayer();
    }

    if (winner) {
        cout << "Player " << winner << " wins!\n";
    } else {
        cout << "It's a draw!\n";
    }
}

int main() {
    game();
    return 0;
}