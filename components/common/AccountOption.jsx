
import Link from "next/link";
import Logout from "../auth/Logout";


export default function AccountOption({ lan,header }) {

  return (
    <>
   
        <div className="absolute right-0 top-full mt-2 w-40 rounded-md bg-white dark:bg-[#ffffff] p-2 z-10 shadow-lg">
          <Link href={`/${lan}/account`}>
            <div className="flex items-center gap-2 p-2 rounded-md cursor-pointer hover:text-white hover:bg-red-500">
              {header?.account}
            </div>
          </Link>
          <Logout langCode={lan} logout={header?.logout} />
          
        </div>
  
    </>
  );
}
