export default class Cells {
    constructor ( context, cellsEdge ) {
        this.ctx = context;
        this.cellsEdge = cellsEdge;
    }

    async init () {
        // Declarations of every cells
        this.cells = await [];
        this.diagonals = await [ [], [] ];
        this.lines = await [];
        this.columns = await [];
        for ( let i = 0; i < this.cellsEdge; i++ ) {
            await this.lines.push( [] );
            await this.columns.push( [] );
        }
    }

    async initCells ( canvasSize ) {
        return new Promise( async ( resolve ) => {
            const edge = await Math.round( canvasSize / this.cellsEdge );

            const saveCellsArr = await [];
            const fillCellsArr = await [];
            // Create every cells
            for ( let i = 0, l = Math.pow( this.cellsEdge, 2 ), row = 0, col; i < l; i++ ) {
                col = i % this.cellsEdge;

                // Calculate coordinates
                const cell = {
                    isActive: true,
                    ownedBy: null,
                    coordinates: [ edge * col, edge * row, edge, edge ]
                };

                const saveCell = await this.saveCell( cell, row, col );
                saveCellsArr.push( saveCell );

                // Update row number
                row = col === this.cellsEdge - 1 ? row + 1 : row;

                // Init color of the cell
                const fillCell = await this.fillCell( i % 2 ? '#eeeeee' : '#fafafa', cell.coordinates );
                fillCellsArr.push( fillCell );
            }

            this.winningCells = await [ this.lines, this.columns, this.diagonals ];

            // resolve( `initCells [${ saveCellsArr }, ${ saveCellsArr }]` );
            resolve( { initCells: saveCellsArr } );
        } );
    }

    async saveCell ( cell, row, col ) {
        return new Promise( async ( resolve ) => {
            // Save cell into array of all cells
            this.cells.push( cell );

            // Save cell into array of lines, array of columns and array of diagonals
            this.lines[ row ].push( cell );
            this.columns[ col ].push( cell );

            // Save cell into array of the main diagonal
            if ( row === col ) {
                this.diagonals[ 0 ].push( cell );
            }
            // Save cell into array of the second diagonal
            if ( row + col === this.cellsEdge - 1 ) {
                this.diagonals[ 1 ].push( cell );
            }

            resolve( `saveCell [${ row }, ${ col }]` );
        } );
    }

    async fillCell ( color, coordinates, borderColor = '#bdbdbd' ) {
        return new Promise( async ( resolve ) => {
            this.ctx.fillStyle = await color;
            await this.ctx.fillRect( ...coordinates );
            this.ctx.strokeStyle = await borderColor;
            await this.ctx.strokeRect( ...coordinates );

            resolve( `fillCell ${ coordinates }` );
        } );
    }

    async isOver ( activePlayer ) {
        return new Promise( async ( resolve ) => {
            let state = {
                isOver: false,
                winner: false
            };

            // Check if the active player is the winner in each line, column or diagonal
            if ( this.winningCells.some( arr => arr.some( cells => cells.every( cell => cell.ownedBy === activePlayer.id ) ) ) ) {
                state.isOver = state.winner = true;
            }

            // Every cells are played
            if ( this.cells.every( cell => cell.isActive === false ) ) {
                state.isOver = true;
            }

            resolve( state );
        } );
    }
}
