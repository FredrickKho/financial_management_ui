import React, { useEffect, useState } from 'react';
import $ from 'jquery';
import DataTable from 'datatables.net-responsive-bs5';
import 'datatables.net-buttons-bs5';
import 'datatables.net-bs5';
import 'datatables.net-buttons/js/buttons.colVis.mjs';
import 'datatables.net-buttons/js/buttons.html5.mjs';
import 'datatables.net-buttons/js/buttons.print.mjs';
import { forEach } from 'jszip';

const InvoicePage = () => {
	const [data, setData] = useState(null);
	const [loading, setLoading] = useState(true); // State for loading status
	const [error, setError] = useState(null);
	const [category, setCategory] = useState(null);
	const [type, setType] = useState(null);
	const [date, setDate] = useState(null);
	const [categoryList, setCategoryList] = useState(null);
	const [addInvoiceFormData,setAddInvoiceFormData] = useState({
		name: '',
		quantity: '',
		totalPrice: '',
		category: '',
		type: 'EARNING',
		location: '',
		date: '',
		note: ''
	})
	let totalEarning = 0;
	let totalSpending = 0;

	const changeNumberFormat = (number) => {
		const formattedNumber = number.toLocaleString('id-ID');

		return `Rp ${formattedNumber}`;
	};

	useEffect(() => {
		const jsZipScript = document.createElement('script');
		jsZipScript.src =
			'https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js';
		jsZipScript.async = true;
		document.head.appendChild(jsZipScript);

		const pdfScript = document.createElement('script');
		pdfScript.src =
			'https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.2.7/pdfmake.min.js';
		pdfScript.async = true;
		document.head.appendChild(pdfScript);

		const vfsFontScript = document.createElement('script');
		vfsFontScript.src =
			'https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.2.7/vfs_fonts.js';
		vfsFontScript.async = true;
		document.head.appendChild(vfsFontScript);
		return () => {
			// Cleanup the scripts if needed
			document.head.removeChild(jsZipScript);
			document.head.removeChild(pdfScript);
			document.head.removeChild(vfsFontScript);
		};
	}, []);

	const fetchData = async () => {
		const url = new URL(
			`${process.env.REACT_APP_API_URL}/api/item/getAccountItemWithoutPagination`
		);
		const params = new URLSearchParams();
		if (category != null) params.append('category', category);
		if (type != null) params.append('type', type);
		if (date != null) params.append('date', date);
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

			response = await fetch(
				`${process.env.REACT_APP_API_URL}/api/x-item/category`
			);
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
		setLoading(true);
		fetchData();
	}, [type, date, category]);

	useEffect(() => {
		if (categoryList && !$.fn.dataTable.isDataTable('#myTable')) {
			new DataTable('#myTable', {
				destroy: true,
				lengthChange: false,
				autoWidth: false,
				columnDefs: [
					{
						targets: 7,
						defaultContent: '-',
						target: '_all',
					},
				],
				layout: {
					topStart: {
						buttons: [
							{
								extend: 'copy',
								title: 'Notance_Report',
							},
							{
								extend: 'pdf',
								title: 'Notance_Report',
							},
							{
								extend: 'excel',
								title: 'Notance_Report',
							},
							{
								extend: 'csv',
								title: 'Notance_Report',
							},
						],

						div: {
							html: `	
								<div class="d-flex container">
									<div class="filterCategory">
										<label>Category</label>
									</div>
									<div class="filterType mx-2">
										<label>Type</label>
									</div>
									<div class="resetFilter mx-2 d-flex">
										
									</div>
								</div>		
								`,
							className: 'dt-buttons btn-group flex-wrap mx-4',
						},
					},
				},
				initComplete: function () {
					const categorySelect = $(
						'<select id="categorySelect" class="form-select"><option value="All" selected>All</option></select>'
					)
						.appendTo('.filterCategory') // Append to the DataTable wrapper
						.on('change', function () {
							const selectedCategory = $(this).val();
							setCategory(selectedCategory); // React state update for category
						});
					categoryList.forEach((cat) => {
						categorySelect.append(
							`<option value="${cat}" ${
								category == cat ? 'selected' : ''
							}>${cat}</option>`
						);
					});

					const typeSelect = $(
						'<select id="typeSelect" class="form-select"><option value="All" selected>All</option></select>'
					)
						.appendTo('.filterType') // Append to the DataTable wrapper
						.on('change', function () {
							const selectedType = $(this).val();
							setType(selectedType); // React state update for category
						});
					typeSelect.append(
						`<option value="EARNING" ${
							type == 'EARNING' ? 'selected' : ''
						}>EARNING</option>`
					);
					typeSelect.append(
						`<option value="SPENDING" ${
							type == 'SPENDING' ? 'selected' : ''
						}>SPENDING</option>`
					);
					const resetFilter = $('<button>Reset</button>')
						.appendTo('.resetFilter')
						.on('click', function () {
							setCategory(null);
							setType(null);
						});
				},
			});
		}
	}, [categoryList]);
	const handleAddInvoiceChange = (e) => {
		const { name, value } = e.target;
		setAddInvoiceFormData({
		  ...addInvoiceFormData,
		  [name]: value,
		});
	  };
	const addInvoice = async () => {
		try {
			const response = await fetch('/api/item/create', {
			  method: 'POST',
			  headers: {
				'Content-Type': 'application/json',
			  },
			  credentials:'include',
			  body: JSON.stringify(addInvoiceFormData),
			});
	  
			if (response.ok) {
			  const data = await response.json();
			  console.log('Invoice added successfully:', data);
			  // Optionally, you can clear the form or display a success message
			} else {
			  console.error('Error adding invoice');
			}
		  } catch (error) {
			console.error('Error submitting the form:', error);
		  }
	}
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
			{console.log(data)}
			<div className="card">
				<div className="card-header">
					<h3 className="card-title">DataTable with default features</h3>
				</div>
				{/* <!-- /.card-header --> */}
				<div className="card-body">
					<div className="modal fade" id="addInvoiceModal" tabIndex="-1" aria-labelledby="exampleModalCenteredScrollableTitle" style={{display: 'none'}} aria-hidden="true">
						<div className="modal-dialog modal-dialog-centered modal-dialog-scrollable">
							<form className="modal-content">
								<div className="modal-header">
									<h5 className="modal-title" id="exampleModalCenteredScrollableTitle">Add invoice</h5>
									<button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
								</div>
								<div className="modal-body">
									<div class="mb-3">
										<label class="form-label">Item name*</label>
										<input type="text" name='name' required class="form-control" id="itemName" aria-describedby="itemName" onChange={handleAddInvoiceChange}/>
									</div>
									<div class="mb-3">
										<label class="form-label">Quantity*</label>
										<input type="number" name='quantity' required class="form-control" id="quantity" onChange={handleAddInvoiceChange}/>
									</div>
									<div class="mb-3">
										<label class="form-label">Total item price (Rp)*</label>
										<input type="number" name='totalPrice' required class="form-control" id="totalPrice" onChange={handleAddInvoiceChange}/>
									</div>
									<div class="mb-3">
										<label class="form-label">Category*</label>
										<select className='form-select' name='category' onChange={handleAddInvoiceChange}>
											{categoryList.map((cat,i) => {
												return (<option value={cat}>{cat}</option>)
											})}
										</select>
									</div>
									<div class="mb-3">
										<label class="form-label">Item type*</label>
										<select className='form-select' name='type' onChange={handleAddInvoiceChange}>
											<option value="EARNING">EARNING</option>
											<option value="SPENDING">SPENDING</option>
										</select>
									</div>
									<div class="mb-3">
										<label class="form-label">Location</label>
										<input type="text" name='location' class="form-control" id="location" aria-describedby="location" onChange={handleAddInvoiceChange}/>
									</div>
									<div class="mb-3">
										<label class="form-label">Date</label>
										<input type="date" name='date' class="form-control" id="date" aria-describedby="date" onChange={handleAddInvoiceChange}/>
									</div>
									<div class="mb-3">
										<label class="form-label">Note</label>
										<textarea class="form-control" name='note' id="note" aria-describedby="note" onChange={handleAddInvoiceChange}/>
									</div>
								</div>
								<div className="modal-footer">
									<button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
									<button type="button" className="btn btn-primary" onClick={addInvoice}>Add Invoice</button>
								</div>
							</form>
						</div>
					</div>
					<div>
						<button
							type="button"
							className="btn btn-primary"
							data-bs-toggle="modal"
							data-bs-target="#addInvoiceModal">
							Add Invoice
						</button>
					</div>
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
								if (item.type == 'SPENDING') {
									totalSpending = totalSpending + parseInt(item.totalPrice);
								} else {
									totalEarning = totalEarning + parseInt(item.totalPrice);
								}
								return (
									<tr key={i}>
										<td style={{ width: 'fit-content' }}>{item.name}</td>
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
								<th colSpan={3}>TOTAL SPENDING</th>
								<th colSpan={1}>{changeNumberFormat(totalSpending)}</th>
								<th colSpan={3}>TOTAL EARNING</th>
								<th colSpan={1}>{changeNumberFormat(totalEarning)}</th>
							</tr>
						</tfoot>
					</table>
				</div>
				{/* <!-- /.card-body --> */}
			</div>
		</div>
	);
};
export default InvoicePage;
