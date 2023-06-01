import { Button, ButtonGroup } from "@mui/material";
import { GridToolbarContainer, GridToolbarFilterButton, GridToolbarQuickFilter } from "@mui/x-data-grid";
import { useState } from "react";

export default function CustomToolbar() {


    return (
        <GridToolbarContainer sx={{ display: 'inline-block', width: '100%' }}>
            <GridToolbarFilterButton sx={{ float: "left" }} />
            <GridToolbarQuickFilter sx={{ float: "right" }} />
        </GridToolbarContainer>
    );
}