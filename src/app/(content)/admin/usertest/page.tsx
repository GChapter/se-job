"use client";
import { userinfo } from "@/components/DashBoard/user/userinfo";
import { banUser, getListUser, unBanUser } from "@/components/controller";
import {
  DataGrid,
  GridActionsCellItem,
  GridColDef,
  GridRowId,
  GridRowParams,
  GridToolbarQuickFilter,
} from "@mui/x-data-grid";
import { Box } from "@radix-ui/themes";
import { UUID } from "crypto";
import React, { useMemo, useState } from "react";
import { FaLock, FaUnlock } from "react-icons/fa";

function QuickSearch() {
  return (
    <Box
      style={{
        padding: "0.5rem",
        paddingBottom: 0,
      }}
    >
      <GridToolbarQuickFilter className="bg-[#b1f2b9] rounded-md" />
    </Box>
  );
}

export default function UserList() {
  const [tdata, setData] = useState<userinfo[]>([]);
  const fetchdata = async () => {
    setData(await getListUser());
  };

  const handleBanUser = async (user_id: UUID) => {
    await banUser(user_id);
    fetchdata();
  };
  const handleUnBanUser = async (user_id: UUID) => {
    await unBanUser(user_id);
    fetchdata();
  };

  React.useEffect(() => {
    fetchdata();
  }, []);

  const columns: GridColDef[] = useMemo(
    () => [
      { field: "id", headerName: "No.", flex: 0.1, minWidth: 50 },
      { field: "user_id", headerName: "user_id", flex: 0.1, minWidth: 50 },
      { field: "name", headerName: "Name", flex: 0.2, minWidth: 150 },
      { field: "email", headerName: "Email", flex: 0.2, minWidth: 200 },
      {
        field: "last_login",
        headerName: "Last Login",
        flex: 0.1,
        minWidth: 100,
      },
      { field: "role", headerName: "Role", flex: 0.1, minWidth: 100 },
      {
        field: "actions",
        headerName: "Action",
        type: "actions",
        flex: 0.2,
        width: 100,
        getActions: (params) => [
          <GridActionsCellItem
            icon={
              <FaLock
                style={{ color: params.row.banned_until ? "red" : "black" }}
              />
            }
            label="Ban"
            onClick={() => handleBanUser(params.row.user_id)}
          />,
          <GridActionsCellItem
            icon={
              <FaUnlock
                style={{ color: !params.row.banned_until ? "red" : "black" }}
              />
            }
            label="Unlock"
            onClick={() => handleUnBanUser(params.row.user_id)}
          />,
        ],
      },
    ],
    []
  );

  return (
    <div style={{ height: "100%", width: "100%" }}>
      <DataGrid
        rows={tdata}
        columns={columns}
        initialState={{
          pagination: {
            paginationModel: { page: 0, pageSize: 5 },
          },
          columns: {
            columnVisibilityModel: {
              user_id: false,
            },
          },
        }}
        disableColumnFilter
        disableColumnSelector
        disableDensitySelector
        pageSizeOptions={[5, 9]}
        slots={{ toolbar: QuickSearch }}
      />
    </div>
  );
}
