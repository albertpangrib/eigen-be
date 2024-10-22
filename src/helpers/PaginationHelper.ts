const PaginationHelper = (
  page: string | number,
  pageSize: string | number
): number => {
  const pageNumber = Number(page) || 1;
  const pageSizeNumber = Number(pageSize) || 0;
  return (pageNumber - 1) * pageSizeNumber;
};

export default PaginationHelper;
