import { BrowserRouter, Routes,Route } from "react-router-dom";
import { Layout } from "./pages/Layout";
import { Login } from "./pages/Login";
import { Dashboard } from "./pages/RequestorRoute/Dashboard";
import { RequestorRoute } from "./pages/routes/RequestorRoute";
import {AdminRoute} from "./pages/routes/AdminRoute";
import { ApproverRoute } from "./pages/routes/ApproverRoute";
import { AdminDashboard } from "./pages/AdminRoute/AdminDashBoard";
import { ApproverDashboard } from "./pages/ApproverRoute/ApproverDashboard";
import NotFound from "./pages/NotFound";
import { Accounts } from "./pages/AdminRoute/Accounts";
import { Register } from "./pages/AdminRoute/Register";
import { AOMRoute } from "./pages/routes/AOMRoute";
import { AOMDashboard } from "./pages/AOMRoute/AOMDashboard";
import { SemiApproverRoute } from "./pages/routes/SemiApproverRoute";
import { SemiApproverDashboard } from "./pages/ApproverSemiRoute/SemiApproverDashboard";
import { Department } from "./pages/AdminRoute/Department";
import { UserView } from "./pages/AdminRoute/UserView";
import { Branch } from "./pages/AdminRoute/Branch";
import { Reports } from "./pages/AdminRoute/Reports";
import { Printpreview } from "./pages/Printpreview";
import { PurchasingRoute } from "./pages/routes/PurchasingRoute";
import { PurchasingDashboard } from "./pages/PurchasingRoute/PurchasingDashboard";



function App() {

  return (

    <BrowserRouter future={{
      v7_relativeSplatPath: true,
      v7_startTransition: true,
    }}
    >
      <Routes path="/" element={<Layout/>}>

        <Route path="/" element={<Login/>} />
        <Route path="*" element={<NotFound/>}/>
        <Route path="print-preview" element={<Printpreview/>}/>

        {/* Requestor Routes */}
        <Route element={<RequestorRoute/>}>
          <Route path="user-dashboard" element={<Dashboard/>}/>
        </Route>

        {/* Admin Routes */}
        <Route element={<AdminRoute/>}>
          <Route path="admin-dashboard" element={<AdminDashboard/>}/>
          <Route path="accounts" element={<Accounts/>}/>
          <Route path='accounts/register' element={<Register/>} />
          <Route path="new-department" element={<Department/>}/>
          <Route path="user-account" element={<UserView/>}/>
          <Route path="branch" element={<Branch/>}/>
          <Route path="reports" element={<Reports/>}/>
        </Route>

        {/* Approver Routes */}
        <Route element={<ApproverRoute/>}>
          <Route path="approver-dashboard" element={<ApproverDashboard/>}/>
        </Route>

        {/* AOM Routes */}
        <Route element={<AOMRoute/>}>
          <Route path="aom-dashboard" element={<AOMDashboard/>}/>
        </Route>
        
        <Route element={<SemiApproverRoute/>}>
          <Route path="semi-approver-dashboard" element={<SemiApproverDashboard/>}/>
        </Route>

        <Route element={<PurchasingRoute/>}>
          <Route path="purchasing-dashboard" element={<PurchasingDashboard/>}/>
        </Route>
        
      </Routes>

    </BrowserRouter>
  
  )
}

export default App
