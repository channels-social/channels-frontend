import React from "react";

const DNSTable = ({ token }) => {
  return (
    <div className="dark:bg-transparent border dark:border-chatBackground-dark rounded-lg  w-max">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="border-b dark:border-b-chatBackground-dark dark:bg-chatDivider-dark">
            <th className="px-8 py-3 text-sm font-medium dark:text-secondaryText-dark border-r dark:border-chatBackground-dark w-1/3">
              Host
            </th>
            <th className="px-8 py-3 text-sm font-medium dark:text-secondaryText-dark border-r dark:border-chatBackground-dark w-1/3">
              Type
            </th>
            <th className="px-10 py-3 text-sm font-medium dark:text-secondaryText-dark w-1/3">
              Value
            </th>
          </tr>
        </thead>
        <tbody>
          <tr className="border-t dark:border-t-chatBackground-dark">
            <td className="p-4 dark:text-primaryText-dark border-r dark:border-chatBackground-dark whitespace-nowrap">
              @ (leave blank)
            </td>
            <td className="p-4 dark:text-primaryText-dark border-r dark:border-chatBackground-dark">
              TXT
            </td>
            <td className="p-4 dark:text-primaryText-dark lg:whitespace-nowrap">
              channels-verification={token}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default DNSTable;
