import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import { useState } from "react";

const MuiGrid = ({ data, columns, clickHandler, setIds }) => {
    const [pageSize, setPageSize] = useState(10);

    return (
        <DataGrid
            rows={data}
            columns={columns}
            rowsPerPageOptions={[10, 20, 50, 100]}
            pageSize={pageSize}
            onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
            rowHeight={40}
            checkboxSelection
            autoHeight={true}
            // onRowClick=
            onSelectionModelChange={(newSelection) => {
                setIds(newSelection);
            }}
        />
    )
}

export default MuiGrid