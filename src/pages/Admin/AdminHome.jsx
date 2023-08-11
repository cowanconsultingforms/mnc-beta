import Sidebar from "../../components/Admin/Sidebar";

const AdminHome = () => {
  return (
    <div className="flex">
      <Sidebar />
      <div className="homeContainer flex-[6]">container</div>
    </div>
  );
};

export default AdminHome;
