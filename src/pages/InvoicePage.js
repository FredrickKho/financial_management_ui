import React, { useEffect, useState } from 'react';
import { Pagination } from 'react-bootstrap';

const InvoicePage = () => {
	const [data, setData] = useState(null);
	const [pagination, setPagination] = useState(null);
	const [loading, setLoading] = useState(true); // State for loading status
	const [error, setError] = useState(null);
	const [page, setPage] = useState(null);
	const [size, setSize] = useState(null);
	const [category, setCategory] = useState(null);
	const [type, setType] = useState(null);
	const [date, setDate] = useState(null);
	useEffect(() => {
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
		return () => {
			document.head.removeChild(pdfScript);
			document.head.removeChild(vfsFont);
		};
	});
	const fetchData = async () => {
		const url = new URL(
			`${process.env.REACT_APP_API_URL}/api/item/getAccountItem`
		);
		const params = new URLSearchParams();
		if (category != null) params.append('category', category);
		if (type != null) params.append('type', type);
		if (date != null) params.append('date', date);
		if (page != null) params.append('page', page);
		if (size != null) params.append('size', size);
		url.search = params.toString();
		try {
			const response = await fetch(url, {
				method: 'GET',
				credentials: 'include',
			});
			if (!response.ok) {
				throw new Error('Network response was not ok');
			}
			const result = await response.json(); // Parse JSON
			setData(result.data);
			setPagination(result.pagination);
		} catch (error) {
			setError(error.message);
		} finally {
			setLoading(false);
		}
	};
	useEffect(() => {
		fetchData();
	}, []);

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
					<div
						id="table_wrapper"
						className="table-responsive">
						<table
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
											<td>{item.totalPrice}</td>
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
						<Pagination>
							<Pagination.First />
							<Pagination.Prev />
							<Pagination.Item>{1}</Pagination.Item>
							<Pagination.Ellipsis />

							<Pagination.Item>{10}</Pagination.Item>
							<Pagination.Item>{11}</Pagination.Item>
							<Pagination.Item active>{12}</Pagination.Item>
							<Pagination.Item>{13}</Pagination.Item>
							<Pagination.Item disabled>{14}</Pagination.Item>

							<Pagination.Ellipsis />
							<Pagination.Item>{20}</Pagination.Item>
							<Pagination.Next />
							<Pagination.Last />
						</Pagination>
					</div>
				</div>
				{/* <!-- /.card-body --> */}
			</div>
		</div>
	);
};
export default InvoicePage;
