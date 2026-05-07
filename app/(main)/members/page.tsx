import AddMemberDialog from "../../../components/InviteLink";
import SearchMembersInput from "../../../components/MemberSearchInput";
import { findWorkspaceMembers } from "../../../lib/actions/workspaceMember.action";

interface ProjectsProps {
  searchParams?: { search?: string };
}

const Members = async ({ searchParams }: ProjectsProps) => {
  const params =  await searchParams;
  const members = await findWorkspaceMembers(params?.search);

  return (
    <div className="flex-1 overflow-auto w-full">
      <div className="p-6 max-w-7xl mx-auto">
        <h1 className="w-full text-2xl font-semibold text-foreground pb-6 flex justify-between items-center">
          Members
          <AddMemberDialog />
        </h1>
        <SearchMembersInput />
        <h1 className="mt-8 text-sm font-medium text-muted-foreground uppercase tracking-wider">People you work with</h1>
        <div className="w-full mt-6 flex gap-4 flex-wrap">
          {members && members.length > 0 ? (
            members?.map((item) => (
            <div
              key={item.id}
              className="w-[181px] h-[221px] rounded-md border p-3 flex flex-col justify-start items-center gap-y-2"
            >
              <span className="w-[128px] h-[128px] rounded-full bg-button-hover text-white text-[64px] flex justify-center items-center">
              </span>
              <p className="max-w-full w-full text-center overflow-hidden text-ellipsis whitespace-nowrap text-sm">
                {item.user.profiles?.username || item.user.profiles?.email || "User"}
              </p>
            </div>
          ))
        ) : (
          <p className="text-muted-foreground">Member not found.</p>
        )}
        </div>
      </div>
    </div>
  );
};
export default Members;
