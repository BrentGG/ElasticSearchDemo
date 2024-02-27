/* https://phuoc.ng/collection/html-dom/resize-columns-of-a-table/ */

function makeTableResizable() {
    const createResizableTable = function (table) {
        const cols = table.querySelectorAll('th');
        for (let i = 0; i < cols.length; ++i) {
            // Add a resizer element to the column
            const resizer = document.createElement('div');
            resizer.classList.add('resizer');

            // Set the height
            resizer.style.height = table.offsetHeight + 'px';

            cols[i].appendChild(resizer);

            createResizableColumn(cols[i], i < cols.length - 1 ? cols[i + 1] : null, resizer);
        }
    };

    const createResizableColumn = function (col, nextCol, resizer) {
        let x = 0;
        let w = 0;
        let nextW = 0;

        const mouseDownHandler = function (e) {
            x = e.clientX;

            w = parseInt(window.getComputedStyle(col).width, 10);
            nextW = parseInt(window.getComputedStyle(nextCol).width, 10);

            document.addEventListener('mousemove', mouseMoveHandler);
            document.addEventListener('mouseup', mouseUpHandler);

            resizer.classList.add('resizing');
        };

        const mouseMoveHandler = function (e) {
            const dx = e.clientX - x;
            col.style.width = (w + dx) + 'px';
            nextCol.style.width = (nextW - dx) + 'px';
        };

        const mouseUpHandler = function () {
            resizer.classList.remove('resizing');
            document.removeEventListener('mousemove', mouseMoveHandler);
            document.removeEventListener('mouseup', mouseUpHandler);
        };

        if (nextCol != null)
            resizer.addEventListener('mousedown', mouseDownHandler);
    };

    createResizableTable(document.getElementById("results-table"));
}