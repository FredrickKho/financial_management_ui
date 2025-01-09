
import React, { useEffect, useState } from 'react';
import $ from 'jquery';
import DataTable from 'datatables.net-responsive-bs5';
import 'datatables.net-buttons-bs5'
import 'datatables.net-bs5'
import 'datatables.net-buttons/js/buttons.colVis.mjs';
import 'datatables.net-buttons/js/buttons.html5.mjs';
import 'datatables.net-buttons/js/buttons.print.mjs';

const InvoicePage = () => {
	const [data, setData] = useState(null);
	const [dataWithoutFilter, setDataWithoutFilter] = useState(null);
	const [pagination, setPagination] = useState(null);
	const [loading, setLoading] = useState(true); // State for loading status
	const [error, setError] = useState(null);
	const [page, setPage] = useState(1);
	const [size, setSize] = useState(5);
	const [category, setCategory] = useState(null);
	const [type, setType] = useState(null);
	const [date, setDate] = useState(null);
	const [searchItem, setSearchItem] = useState(null);
	const [categoryList,setCategoryList] = useState(null);
	let totalPrice = 0;
	useEffect(() => {
		// const datatableCSS = document.createElement('link');
		// datatableCSS.rel = "stylesheet"
		// datatableCSS.href = "https://cdn.datatables.net/v/bs5/jszip-3.10.1/dt-2.1.8/b-3.2.0/b-colvis-3.2.0/b-html5-3.2.0/b-print-3.2.0/r-3.0.3/datatables.min.css"
		// const datatableJS = document.createElement('script');
		// datatableJS.src = './'
		// datatableJS.async = true;
		const jsZip = document.createElement('script');
		jsZip.src =
			'https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js';
		jsZip.async = true;
		const vfsFont = document.createElement('script');
		vfsFont.src =
			'https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.2.7/vfs_fonts.js';
		vfsFont.async = true;
		const pdfScript = document.createElement('script');
		pdfScript.src =
			'https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.2.7/pdfmake.min.js';
		pdfScript.async = true;
		document.head.appendChild(pdfScript);
		document.head.appendChild(vfsFont);
		document.head.appendChild(jsZip);
		// document.head.appendChild(datatableCSS)
		// document.head.appendChild(datatableJS)
		return () => {
			document.head.removeChild(pdfScript);
			document.head.removeChild(vfsFont);
			document.head.removeChild(jsZip);
			// document.head.removeChild(datatableCSS)
			// document.head.removeChild(datatableJS)
		};
	},[]);
	const fetchData = async () => {
		const url = new URL(
			`${process.env.REACT_APP_API_URL}/api/item/getAccountItemWithoutPagination`
		);
		const params = new URLSearchParams();
		if (category != null) params.append('category', category);
		if (type != null) params.append('type', type);
		if (date != null) params.append('date', date);
		// if (page != null) params.append('page', page);
		// if (size != null) params.append('size', size);
		url.search = params.toString();
		try {
			let response = await fetch(url, {
				method: 'GET',
				credentials: 'include',
			});
			if (!response.ok) {
				throw new Error('Network response was not ok');
			}
			let result = await response.json(); // Parse JSON
			setData(result.data);
			
			response = await fetch(`${process.env.REACT_APP_API_URL}/api/x-item/categories`);
			if (!response.ok) {
				throw new Error('Network response was not ok');
			}
			result = await response.json();
			setCategoryList(result.data); 
			// setDataWithoutFilter(result.data);
			// setPagination(result.pagination);
		} catch (error) {
			setError(error.message);
		} finally {
			setLoading(false);
		}
	};
	useEffect(() => {
		fetchData();
	}, [page, size, type, date, category]);
	const changeNumberFormat = (number) => {
		const formattedNumber = number.toLocaleString('id-ID');

		return `Rp ${formattedNumber}`;
	};
	// useEffect(() => {
	// 	if (searchItem == '' || searchItem == null) {
	// 		setData(dataWithoutFilter);
	// 	} else {
	// 		const lowercasedSearch = searchItem.toLowerCase();
	// 		const filtered = data.filter((item) =>
	// 			item.name.toLowerCase().includes(lowercasedSearch)
	// 		);
	// 		setData(filtered);
	// 	}
	// }, [searchItem]);
	
	useEffect(() => {
		if(categoryList){
			$("#myTable").DataTable({
				lengthChange:false,
				autoWidth:false,
				layout:{
					topStart:{
						buttons:[{
							'extend':'copy',
							'title' : 'Notance_Report'
						},{
							'extend' : 'pdf',
							'title' : 'Notance_Report'
						},{
							'extend' : 'excel',
							'title' : 'Notance_Report'
						},{
							'extend' : 'csv',
							'title' : 'Notance_Report'
						}],
						div:{
							html:`	
								<div>
									<label>Category</label>
									<select class="form-select" aria-label="Default select example">
										<option selected>All</option>
										${console.log(categoryList)}
										${categoryList.map((category,i)=> {
											console.log(category)
											return (
												`<option key=${i} value=${category}>${category}</option>`
											);
										})}
									</select>
								</div>		
								`,
							className : "dt-buttons btn-group flex-wrap mx-4"
						}
					}
				},
				destroy:true
			})
		}
	  }, [data,categoryList]);
	  
	if (loading)
		return (
			<div className="content-wrapper d-flex justify-content-center flex-column align-items-center">
				<div
					className="spinner-border"
					role="status">
					<span className="visually-hidden"></span>
				</div>
			</div>
		);
	return (
		<div
			className="content-wrapper px-4 py-2"
			style={{ overflowY: 'auto', maxHeight: '0vh' }}>
			
			<div className="card">
				<div className="card-header">
					<h3 className="card-title">DataTable with default features</h3>
				</div>
				{/* <!-- /.card-header --> */}
				<div className="card-body">
				<table
							id="myTable"
							className="table table-bordered table-striped">
							<thead>
								<tr className="border-5">
									<th data-priority="1">Name</th>
									<th data-priority="2">Quantity</th>
									<th>Category</th>
									<th>Type</th>
									<th>Date</th>
									<th data-priority="3">Total Price</th>
									<th>Note</th>
									<th>Action</th>
								</tr>
							</thead>
							<tbody>
								{data.map((item, i) => {
									totalPrice = totalPrice+ parseInt(item.totalPrice);
									return (
										<tr key={i}>
											<td style={{width:'fit-content'}}>{item.name}</td>
											<td>{item.quantity}</td>
											<td>{item.category}</td>
											<td>{item.type}</td>
											<td>{item.date}</td>
											<td>{changeNumberFormat(item.totalPrice)}</td>
											<td>{item.note}</td>
											<td>action</td>
										</tr>
									);
								})}
							</tbody>
							<tfoot>
								<tr>
									<th colSpan={5}>TOTAL</th>
									<th colSpan={3}>{changeNumberFormat(totalPrice)}</th>
								</tr>
							</tfoot>
						</table>
						
						
						{/* <table
							id="example1"
							className="table table-bordered table-striped"
							width="100%">
							<thead>
								<tr className="border-5">
									<th>Name</th>
									<th>Quantity</th>
									<th>Category</th>
									<th>Type</th>
									<th>Date</th>
									<th>Total Price</th>
									<th>Note</th>
									<th>Action</th>
								</tr>
							</thead>
							<tbody>
								{data.map((item, i) => {
									return (
										<tr key={i}>
											<td>{item.name}</td>
											<td>{item.quantity}</td>
											<td>{item.category}</td>
											<td>{item.type}</td>
											<td>{item.date}</td>
											<td>{changeNumberFormat(item.totalPrice)}</td>
											<td>{item.note}</td>
											<td>action</td>
										</tr>
									);
								})}
							</tbody>
							<tfoot>
								<tr>
									<th colSpan={5}>TOTAL</th>
									<th colSpan={3}>28392893</th>
								</tr>
							</tfoot>
						</table>
						<div className="d-flex justify-content-end align-items-center px-3">
							<Pagination className="mx-5 my-0">
								<Pagination.First
									disabled={page === 1}
									onClick={() => {
										setPage(1);
									}}
								/>
								<Pagination.Prev
									disabled={page === 1}
									onClick={() => {
										setPage(page - 1);
									}}
								/>
								{page - 2 > 0 && (
									<Pagination.Item
										onClick={() => {
											setPage(page - 2);
										}}>
										{page - 2}
									</Pagination.Item>
								)}
								{page - 1 > 0 && (
									<Pagination.Item
										onClick={() => {
											setPage(page - 1);
										}}>
										{page - 1}
									</Pagination.Item>
								)}
								<Pagination.Item active>{page}</Pagination.Item>
								{page + 1 <= pagination.totalPage && (
									<Pagination.Item
										onClick={() => {
											setPage(page + 1);
										}}>
										{page + 1}
									</Pagination.Item>
								)}
								{page + 2 <= pagination.totalPage && (
									<Pagination.Item
										onClick={() => {
											setPage(page + 2);
										}}>
										{page + 2}
									</Pagination.Item>
								)}
								<Pagination.Next
									disabled={page === pagination.totalPage}
									onClick={() => {
										setPage(page + 1);
									}}
								/>
								<Pagination.Last
									disabled={page === pagination.totalPage}
									onClick={() => {
										setPage(pagination.totalPage);
									}}
								/>
							</Pagination>
							<div className="dropdown-pagination d-flex align-items-center">
								<p className="m-0 pr-2">Item per page</p>
								<Dropdown>
									<Dropdown.Toggle
										variant="secondary"
										id="dropdown-basic">
										{size}
									</Dropdown.Toggle>

									<Dropdown.Menu>
										{size != 5 && (
											<Dropdown.Item
												onClick={() => {
													setSize(5);
													setPage(1);
												}}>
												5
											</Dropdown.Item>
										)}
										{size != 10 && (
											<Dropdown.Item
												onClick={() => {
													setSize(10);
													setPage(1);
												}}>
												10
											</Dropdown.Item>
										)}
										{size != 50 && (
											<Dropdown.Item
												onClick={() => {
													setSize(50);
													setPage(1);
												}}>
												50
											</Dropdown.Item>
										)}
										{size != 100 && (
											<Dropdown.Item
												onClick={() => {
													setSize(100);
													setPage(1);
												}}>
												100
											</Dropdown.Item>
										)}
									</Dropdown.Menu>
								</Dropdown>
							</div>
						</div> */}
				</div>
				{/* <!-- /.card-body --> */}
			</div>
		</div>
	);
};
export default InvoicePage;
