import AddUpdate from "../../admin-components/AddUpdate";

export default async function page(props) {
  const params = await props.params;

  const { update } = params;

  return (
    <div className="relative md:ml-64 bg-blueGray-100 mt-[40px]">
      <AddUpdate updateId={update} />
    </div>
  );
}
