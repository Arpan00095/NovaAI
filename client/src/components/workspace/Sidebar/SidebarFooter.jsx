import UserMenu from "./UserMenu";

const SidebarFooter = ({
  collapsed,
}) => {

  return (

    <div
      className="
        border-t
        border-slate-800
        p-4
      "
    >

      <UserMenu
        collapsed={collapsed}
      />

    </div>

  );

};

export default SidebarFooter;