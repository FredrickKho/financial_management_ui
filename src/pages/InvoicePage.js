import React, { useCallback, useEffect, useState } from 'react';
import $ from 'jquery';
import DataTable from 'datatables.net-responsive-bs5';
import 'datatables.net-buttons-bs5';
import 'datatables.net-bs5';
import 'datatables.net-buttons/js/buttons.colVis.mjs';
import 'datatables.net-buttons/js/buttons.html5.mjs';
import 'datatables.net-buttons/js/buttons.print.mjs';
import 'datatables.net-plugins/dataRender/ellipsis.mjs';

const InvoicePage = () => {
	document.title="Nelvonce - Invoice"
	const [data, setData] = useState(null);
	const [loading, setLoading] = useState(true); // State for loading status
	const [category, setCategory] = useState(null);
	const [type, setType] = useState(null);
	const [date, setDate] = useState(null);
	const [startDate, setStartDate] = useState(null);
	const [endDate, setEndDate] = useState(null);
	const [categoryList, setCategoryList] = useState(null);
	const [invoice,setInvoice] = useState({
		name: '',
		quantity: '',
		totalPrice: '',
		category: '',
		type: '',
		location: '',
		date: '',
		note: '',
	});
	const [addInvoiceFormData, setAddInvoiceFormData] = useState({
		name: '',
		quantity: '',
		totalPrice: '',
		category: 'Food or drink',
		type: 'EARNING',
		location: '',
		date: '',
		note: '',
	});
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

	const fetchData = useCallback(async () => {
		const url = new URL(
			`${process.env.REACT_APP_API_URL}/api/item/getAccountItemWithoutPagination`
		);
		const params = new URLSearchParams();
		if (category != null) params.append('category', category);
		if (type != null) params.append('type', type);
		if (startDate != null) params.append('startDate',startDate);
		if (endDate != null) params.append('endDate',endDate);
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
			console.error(error.message);
		} finally {
			setLoading(false);
		}
	}, [type, category, startDate, endDate]);
	useEffect(() => {
		setLoading(true);
		fetchData();
	}, [fetchData]);
	useEffect(() => {
		if (categoryList && !$.fn.dataTable.isDataTable('#myTable')) {
			new DataTable('#myTable', {
				destroy: true,
				lengthChange: false,
				autoWidth: false,
				columnDefs: [
					{
						targets:0,
						width:"38%",
					},{
						targets:1,
						width:"5%"
					},{
						targets:2,
						width:"11%"
					},{
						targets:3,
						width:"10%"
					},{
						targets:4,
						width:"8%"
					},{
						targets:5,
						width:"10%"
					},{
						targets:6,
						width:"5%"
					},{
						targets:7,
						width:"25%"
					}
				],
				layout: {
					topStart: {
						buttons: [
							{
								extend: 'copy',
								title: 'Nelvonce_Report',
							},
							{
								extend: 'pdf',
								title: 'Nelvonce_Report',
							},
							{
								extend: 'excel',
								title: 'Nelvonce_Report',
							},
							{
								extend: 'csv',
								title: 'Nelvonce_Report',
							},
						],
					},
				},
			});
		}
	}, [categoryList]);
	useEffect(() => {
		if (date === 'today'){
			let today = new Date().toLocaleDateString('en-CA')
			setStartDate(today)
			setEndDate(today)
		}else if (date === 'all'){
			setStartDate(null)
			setEndDate(null)
		}else if (date === 'yesterday'){
			let yesterday = new Date()
			yesterday.setDate(yesterday.getDate() - 1)
			yesterday = yesterday.toLocaleDateString('en-CA')
			setStartDate(yesterday)
			setEndDate(yesterday)
		}else if (date === '3days'){
			let today = new Date().toLocaleDateString('en-CA')
			let threeDaysAgo = new Date()
			threeDaysAgo.setDate(threeDaysAgo.getDate() - 3)
			threeDaysAgo = threeDaysAgo.toLocaleDateString('en-CA')
			setStartDate(threeDaysAgo)
			setEndDate(today)
		}else if (date === 'week'){
			let today = new Date().toLocaleDateString('en-CA')
			let week = new Date()
			week.setDate(week.getDate() - 7)
			week = week.toLocaleDateString('en-CA')
			setStartDate(week)
			setEndDate(today)
		}else if (date === 'thisMonth'){
			let firstDate = new Date()
			let lastDate = new Date(firstDate.getFullYear(),firstDate.getMonth() + 1,0)
			firstDate.setDate(1)
			firstDate = firstDate.toLocaleDateString('en-CA')
			lastDate = lastDate.toLocaleDateString('en-CA')
			setStartDate(firstDate)
			setEndDate(lastDate)
		}
	},[date])
	const handleAddInvoiceChange = (e) => {
		const { name, value } = e.target;
		setAddInvoiceFormData({
			...addInvoiceFormData,
			[name]: value,
		});
	};
	const handleEditInvoiceChange = (e) => {
		const { name, value } = e.target;
		setInvoice({
			...invoice,
			[name]: value,
		});
	};
	const addInvoice = async (event) => {
		event.preventDefault();
		try {
			const response = await fetch(
				`${process.env.REACT_APP_API_URL}/api/item/create`,
				{
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
					},
					credentials: 'include',
					body: JSON.stringify(addInvoiceFormData),
				}
			);

			if (response.ok) {
				window.toastr.success('Invoice added successfully');
				$('#addInvoiceCloseBtn').trigger('click');
				setLoading(true);
				fetchData();
			} else {
				window.toastr.error('Error add invoice');
			}
		} catch (error) {
			console.log('Error submitting the form:', error);
		}
	};
	const editInvoice = async (event,idx) => {
		event.preventDefault()
		try {
			const response = await fetch(
				`${process.env.REACT_APP_API_URL}/api/item/${invoice.id}/update`,
				{
					method: 'PATCH',
					headers: {
						'Content-Type': 'application/json',
					},
					body: JSON.stringify(invoice),
					credentials: 'include',
				}
			);
			if (response.ok) {
				window.toastr.success('Invoice update successfully');
				$('#editInvoiceCloseBtn-'+idx).trigger('click');
				setLoading(true);
				fetchData();
			} else {
				window.toastr.error('Error update invoice');
			}
		} catch (error) {
			console.log('Error submitting the form:', error);
		}
	}
	const deleteInvoice = async (event,id) => {
		event.preventDefault();
		try {
			const response = await fetch(
				`${process.env.REACT_APP_API_URL}/api/item/${id}/delete`,
				{
					method: 'DELETE',
					headers: {
						'Content-Type': 'application/json',
					},
					credentials: 'include',
				}
			);

			if (response.ok) {
				window.toastr.success('Invoice deleted successfully');
				$('#deleteInvoiceBtn').trigger('click');
				setLoading(true);
				fetchData();
			} else {
				window.toastr.error('Error delete invoice');
			}
		} catch (error) {
			console.log('Error deletting the form:', error);
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
			<div className="card">
				<div className="card-header">
					<h3 className="card-title">Invoice</h3>
				</div>
				{/* <!-- /.card-header --> */}
				<div className="card-body">
					<div
						className="modal fade"
						id="addInvoiceModal"
						tabIndex="-1"
						aria-labelledby="exampleModalCenteredScrollableTitle"
						style={{ display: 'none' }}
						aria-hidden="true">
						<div className="modal-dialog modal-dialog-centered modal-dialog-scrollable">
							<form
								className="modal-content"
								onSubmit={addInvoice}>
								<div className="modal-header">
									<h5
										className="modal-title"
										id="exampleModalCenteredScrollableTitle">
										Add invoice
									</h5>
									<button
										type="button"
										id="addInvoiceCloseBtn"
										className="btn-close"
										data-bs-dismiss="modal"
										aria-label="Close"></button>
								</div>
								<div className="modal-body">
									<div className="mb-3">
										<label className="form-label">Item name*</label>
										<input
											type="text"
											name="name"
											required
											className="form-control"
											id="itemName"
											aria-describedby="itemName"
											onChange={handleAddInvoiceChange}
										/>
									</div>
									<div className="mb-3">
										<label className="form-label">Quantity*</label>
										<input
											type="number"
											min={1}
											name="quantity"
											required
											className="form-control"
											id="quantity"
											onChange={handleAddInvoiceChange}
										/>
									</div>
									<div className="mb-3">
										<label className="form-label">Total item price (Rp)*</label>
										<input
											type="number"
											min={1}
											name="totalPrice"
											required
											className="form-control"
											id="totalPrice"
											onChange={handleAddInvoiceChange}
										/>
									</div>
									<div className="mb-3">
										<label className="form-label">Category*</label>
										<select
											className="form-select"
											name="category"
											onChange={handleAddInvoiceChange}>
											{categoryList.map((cat, i) => {
												return <option value={cat} key={i}>{cat}</option>;
											})}
										</select>
									</div>
									<div className="mb-3">
										<label className="form-label">Item type*</label>
										<select
											className="form-select"
											name="type"
											onChange={handleAddInvoiceChange}>
											<option value="Earning">Earning</option>
											<option value="Spending">Spending</option>
										</select>
									</div>
									<div className="mb-3">
										<label className="form-label">Location</label>
										<input
											type="text"
											name="location"
											className="form-control"
											id="location"
											aria-describedby="location"
											onChange={handleAddInvoiceChange}
										/>
									</div>
									<div className="mb-3">
										<label className="form-label">Date</label>
										<input
											type="date"
											name="date"
											required
											className="form-control"
											id="date"
											aria-describedby="date"
											onChange={handleAddInvoiceChange}
										/>
									</div>
									<div className="mb-3">
										<label className="form-label">Note (255 characters)</label>
										<textarea
											className="form-control"
											name="note"
											maxLength={255}
											id="note"
											aria-describedby="note"
											onChange={handleAddInvoiceChange}
										/>
									</div>
								</div>
								<div className="modal-footer">
									<button
										type="button"
										className="btn btn-secondary"
										data-bs-dismiss="modal">
										Close
									</button>
									<button
										type="submit"
										className="btn btn-primary">
										Add Invoice
									</button>
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
					<div className="tableFilter my-3 d-flex justify-content-between">
						<div className="filterCategory">
							<label>Category</label>
							<select id="categorySelect" className="form-select" onChange={(e)=>{setCategory(e.target.value)}}>
								<option value="All" selected>All</option>
								{categoryList.map((cat, i) => {
									return (<option value={cat} key={i} selected={cat === category ? true : false}>{cat}</option>)
								})}
							</select>
						</div>
						<div className="filterType">
							<label>Type</label>
							<select id="typeSelect" className="form-select" onChange={(e)=>{setType(e.target.value)}}>
								<option value="All" selected>All</option>
								<option value="Earning" selected={type === 'Earning' ? true : false}>Earning</option>
								<option value="Spending" selected={type === 'Spending' ? true : false}>Spending</option>
							</select>
						</div>
						<div className="filterDate">
							<label>Date</label>
							<select id="dateSelect" className="form-select" onChange={(e) => {
								setDate(e.target.value)
							}}>
								<option value="all" selected>All</option>
								<option value="today" selected={date === 'today' ? true : false}>Today</option>
								<option value="yesterday" selected={date === 'yesterday' ? true : false}>Yesterday</option>
								<option value="3days" selected={date === '3days' ? true : false}>3 days ago</option>
								<option value="week" selected={date === 'week' ? true : false}>A week ago</option>
								<option value="thisMonth" selected={date === 'thisMonth' ? true : false}>This month</option>
								<option value="customDate" selected={date === 'customDate' ? true : false}>Custom date filter</option>
							</select>
						</div>
						<div className="filterStartDate" style={{display: date === 'customDate' ? 'block' : 'none'}}>
							<label>Start Date</label>
							<input type="date" className="form-control" value={startDate} max={endDate} 
							onChange={(e)=>{
								setStartDate(e.target.value);
							}}
							></input>
						</div>
						<div className="filterEndDate" style={{display: date === 'customDate' ? 'block' : 'none'}}>
							<label>End Date</label>
							<input type="date" className="form-control" value={endDate}  min={startDate}
							onChange={(e)=>{
								setEndDate(e.target.value);
							}}
							></input>
						</div>
						<div className="resetFilter d-flex">
						<button onClick={() => {
							setCategory(null)
							setType(null)
							setDate(null)
							setStartDate(null)
							setEndDate(null)
						}}>Reset</button>
						</div>
					</div>
					<table
						id="myTable"
						className="table table-bordered table-striped w-100"
						>
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
								if (item.type === 'Spending') {
									totalSpending = totalSpending + parseInt(item.totalPrice);
								} else {
									totalEarning = totalEarning + parseInt(item.totalPrice);
								}
								let formattedDate = new Date(item.date).toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' });
								return (
									<tr key={i}>
										<td style={{ width: 'fit-content' }}>{item.name}</td>
										<td>{item.quantity}</td>
										<td>{item.category}</td>
										<td>{item.type}</td>
										<td>{formattedDate}</td>
										<td>{changeNumberFormat(item.totalPrice)}</td>
										<td>
											{item.note ? (
												<div className='view-note'>
													<div
														className="modal fade"
														id="viewNote"
														tabIndex="-1"
														style={{ display: 'none' }}
														aria-hidden="true">
														<div className="modal-dialog modal-dialog-centered modal-dialog-scrollable">
															<div className='modal-content'>
																<div className="modal-header">
																	<h5
																		className="modal-title"
																		id="exampleModalCenteredScrollableTitle">
																		{item.name} Note
																	</h5>
																	<button
																		type="button"
																		id="addInvoiceCloseBtn"
																		className="btn-close"
																		data-bs-dismiss="modal"
																		aria-label="Close"></button>
																</div>
																<div className="modal-body">
																	{item.note}
																</div>
																<div className="modal-footer">
																	<button
																		type="button"
																		className="btn btn-secondary"
																		data-bs-dismiss="modal">
																		Close
																	</button>
																</div>
															</div>
														</div>
													</div>
													<button className='btn btn-secondary' data-bs-target='#viewNote' data-bs-toggle='modal'>View</button>
												</div>
											) : (
												<button className='btn disabled'>No note</button>
											)}
										</td>
										<td className="d-flex justify-content-evenly">
											<div
												className="modal fade"
												id={`deleteInvoice-${i}`}
												tabIndex="-1"
												style={{ display: 'none' }}
												aria-hidden="true">
												<div className="modal-dialog modal-dialog-centered modal-dialog-scrollable">
													<form className='modal-content' onSubmit={(e) => {
														deleteInvoice(e,item.id)
													}}>
														<div className="modal-header">
															<h5
																className="modal-title"
																id="exampleModalCenteredScrollableTitle">
																Delete invoice ({item.name})
															</h5>
															<button
																type="button"
																id="deleteInvoiceBtn"
																className="btn-close"
																data-bs-dismiss="modal"
																aria-label="Close"></button>
														</div>
														<div className="modal-body">
															Are you sure want to delete invoice "{item.name}" ?
														</div>
														<div className="modal-footer">
															<button
																type="button"
																className="btn btn-secondary"
																data-bs-dismiss="modal">
																Close
															</button>
															<button
																type="submit"
																className="btn btn-danger"
																data-bs-dismiss="modal">
																Delete
															</button>
														</div>
													</form>
												</div>
											</div>
											<button className='btn btn-danger' data-bs-target={`#deleteInvoice-${i}`} data-bs-toggle='modal'>Delete</button>
											<div
												className="modal fade"
												id={`editInvoice-${i}`}
												tabIndex="-1"
												style={{ display: 'none' }}
												aria-hidden="true">
												<div className="modal-dialog modal-dialog-centered modal-dialog-scrollable">
												<form
													className="modal-content"
													onSubmit={(event) => editInvoice(event,i)}>
													<div className="modal-header">
														<h5
															className="modal-title"
															id="exampleModalCenteredScrollableTitle">
															Edit invoice
														</h5>
														<button
															type="button"
															id={`editInvoiceCloseBtn-${i}`}
															className="btn-close"
															data-bs-dismiss="modal"
															aria-label="Close"></button>
													</div>
													<div className="modal-body">
														<div className="mb-3">
															<label className="form-label">Item name*</label>
															<input
																type="text"
																name="name"
																required
																className="form-control"
																id="itemName"
																aria-describedby="itemName"
																value={invoice.name}
																onChange={handleEditInvoiceChange}
															/>
														</div>
														<div className="mb-3">
															<label className="form-label">Quantity*</label>
															<input
																type="number"
																min={1}
																name="quantity"
																required
																className="form-control"
																id="quantity"
																value={invoice.quantity}
																onChange={handleEditInvoiceChange}
															/>
														</div>
														<div className="mb-3">
															<label className="form-label">Total item price (Rp)*</label>
															<input
																type="number"
																min={1}
																name="totalPrice"
																required
																className="form-control"
																id="totalPrice"
																value={invoice.totalPrice}
																onChange={handleEditInvoiceChange}
															/>
														</div>
														<div className="mb-3">
															<label className="form-label">Category*</label>
															<select
																className="form-select"
																name="category"
																onChange={handleEditInvoiceChange}>
																{categoryList.map((cat, i) => {
																	return <option value={cat} key={i} selected={cat === item.category ? true : false}>{cat}</option>
																})}
															</select>
														</div>
														<div className="mb-3">
															<label className="form-label">Item type*</label>
															<select
																className="form-select"
																name="type"
																value={invoice.type}
																onChange={handleEditInvoiceChange}>
																<option value="Earning">Earning</option>
																<option value="Spending">Spending</option>
															</select>
														</div>
														<div className="mb-3">
															<label className="form-label">Location</label>
															<input
																type="text"
																name="location"
																className="form-control"
																id="location"
																aria-describedby="location"
																value={invoice.location}
																onChange={handleEditInvoiceChange}
															/>
														</div>
														<div className="mb-3">
															<label className="form-label">Date</label>
															<input
																value={invoice.date}
																type="date"
																name="date"
																className="form-control"
																id="date"
																aria-describedby="date"
																onChange={handleEditInvoiceChange}
															/>
														</div>
														<div className="mb-3">
															<label className="form-label">Note (255 characters)</label>
															<textarea
																value={invoice.note}
																className="form-control"
																name="note"
																maxLength={255}
																id="note"
																aria-describedby="note"
																onChange={handleEditInvoiceChange}
															/>
														</div>
													</div>
													<div className="modal-footer">
														<button
															type="button"
															className="btn btn-secondary"
															data-bs-dismiss="modal">
															Close
														</button>
														<button
															type="submit"
															className="btn btn-primary">
															Edit Invoice
														</button>
													</div>
												</form>
												</div>
											</div>
											<button className="btn btn-info" data-bs-target={`#editInvoice-${i}`} data-bs-toggle='modal'onClick={() => {
												setInvoice(item)
												// console.log(invoice)
											}}>Edit</button>
										</td>
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
