"use client";

import { useEffect, useState } from "react";
import {
	UsersIcon,
	SearchIcon,
	Loader2Icon,
	XIcon,
	TrashIcon,
	ShieldIcon,
	MailIcon,
	PhoneIcon,
	BuildingIcon,
	CalendarIcon,
	LayoutGridIcon,
	FileTextIcon,
} from "lucide-react";

interface UserItem {
	id: string;
	name: string;
	email: string;
	role: string;
	companyName: string;
	phone: string;
	category: string | null;
	exhibitorCategory: string | null;
	sponsorLevel: "PLATINUM" | "GOLD" | "SILVER" | "BRONZE" | null;
	createdAt: string;
	_count: {
		booths: number;
		invoices: number;
	};
}

export default function AdminUsersPage() {
	const [users, setUsers] = useState<UserItem[]>([]);
	const [loading, setLoading] = useState(true);
	const [search, setSearch] = useState("");
	const [roleFilter, setRoleFilter] = useState("ALL");
	const [selectedUser, setSelectedUser] = useState<UserItem | null>(null);
	const [changingRole, setChangingRole] = useState<string | null>(null);
	const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

	const fetchUsers = () => {
		fetch("/api/admin/users")
			.then((r) => r.json())
			.then((data) => {
				if (Array.isArray(data)) setUsers(data);
				setLoading(false);
			})
			.catch(() => setLoading(false));
	};

	useEffect(() => {
		fetchUsers();
	}, []);

	const handleChangeRole = async (userId: string, newRole: string) => {
		setChangingRole(userId);
		const res = await fetch("/api/admin/users", {
			method: "PATCH",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ userId, action: "changeRole", role: newRole }),
		});
		if (res.ok) {
			setUsers((prev) => prev.map((u) => (u.id === userId ? { ...u, role: newRole } : u)));
			if (selectedUser?.id === userId) setSelectedUser({ ...selectedUser, role: newRole });
		}
		setChangingRole(null);
	};

	const handleDelete = async (userId: string) => {
		const res = await fetch(`/api/admin/users?userId=${encodeURIComponent(userId)}`, { method: "DELETE" });
		if (res.ok) {
			setUsers((prev) => prev.filter((u) => u.id !== userId));
			setDeleteConfirm(null);
			if (selectedUser?.id === userId) setSelectedUser(null);
		} else {
			const data = await res.json();
			alert(data.error || "Failed to delete user");
			setDeleteConfirm(null);
		}
	};

	const filtered = users.filter((u) => {
		const matchesSearch =
			u.name.toLowerCase().includes(search.toLowerCase()) ||
			u.email.toLowerCase().includes(search.toLowerCase()) ||
			u.companyName.toLowerCase().includes(search.toLowerCase());
		const matchesRole = roleFilter === "ALL" || u.role === roleFilter;
		return matchesSearch && matchesRole;
	});

	const roleBadge = (role: string) => {
		const colors: Record<string, string> = {
			ADMIN: "bg-red-100 text-red-700",
			EXHIBITOR: "bg-blue-100 text-blue-700",
			SPONSOR: "bg-purple-100 text-purple-700",
		};
		return (
			<span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${colors[role] || "bg-gray-100 text-gray-700"}`}>
				{role}
			</span>
		);
	};

	if (loading) {
		return (
			<div className="flex items-center justify-center py-32">
				<Loader2Icon className="h-8 w-8 animate-spin text-maroon" />
			</div>
		);
	}

	return (
		<div className="max-w-7xl mx-auto">
			<div className="mb-6">
				<h1 className="text-2xl font-bold text-deepBlue font-poppins flex items-center gap-3">
					<ShieldIcon className="h-7 w-7 text-maroon" />
					User Management
				</h1>
				<p className="text-gray-500 mt-1">Manage all registered users, roles, and accounts</p>
			</div>

			{/* Filters */}
			<div className="bg-white rounded-xl border border-gray-200 p-4 mb-6 shadow-sm flex flex-col sm:flex-row gap-3">
				<div className="relative flex-1">
					<SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
					<input
						type="text"
						placeholder="Search by name, email, or company..."
						value={search}
						onChange={(e) => setSearch(e.target.value)}
						className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-maroon/20 focus:border-maroon outline-none"
					/>
				</div>
				<select
					value={roleFilter}
					onChange={(e) => setRoleFilter(e.target.value)}
					className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-maroon/20 focus:border-maroon outline-none"
				>
					<option value="ALL">All Roles</option>
					<option value="ADMIN">Admin</option>
					<option value="EXHIBITOR">Exhibitor</option>
					<option value="SPONSOR">Sponsor</option>
				</select>
			</div>

			{/* Summary */}
			<div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
				<div className="bg-white rounded-lg border border-gray-200 p-4 text-center">
					<p className="text-2xl font-bold text-deepBlue">{users.length}</p>
					<p className="text-xs text-gray-500">Total Users</p>
				</div>
				<div className="bg-white rounded-lg border border-gray-200 p-4 text-center">
					<p className="text-2xl font-bold text-red-600">{users.filter((u) => u.role === "ADMIN").length}</p>
					<p className="text-xs text-gray-500">Admins</p>
				</div>
				<div className="bg-white rounded-lg border border-gray-200 p-4 text-center">
					<p className="text-2xl font-bold text-blue-600">{users.filter((u) => u.role === "EXHIBITOR").length}</p>
					<p className="text-xs text-gray-500">Exhibitors</p>
				</div>
				<div className="bg-white rounded-lg border border-gray-200 p-4 text-center">
					<p className="text-2xl font-bold text-purple-600">{users.filter((u) => u.role === "SPONSOR").length}</p>
					<p className="text-xs text-gray-500">Sponsors</p>
				</div>
			</div>

			{/* Users Table */}
			<div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
				<div className="overflow-x-auto">
					<table className="w-full text-sm">
						<thead>
							<tr className="bg-gray-50 border-b border-gray-200">
								<th className="text-left px-4 py-3 font-semibold text-gray-600">Name</th>
								<th className="text-left px-4 py-3 font-semibold text-gray-600">Email</th>
								<th className="text-left px-4 py-3 font-semibold text-gray-600">Role</th>
								<th className="text-left px-4 py-3 font-semibold text-gray-600">Company</th>
								<th className="text-left px-4 py-3 font-semibold text-gray-600">Booths</th>
								<th className="text-left px-4 py-3 font-semibold text-gray-600">Invoices</th>
								<th className="text-left px-4 py-3 font-semibold text-gray-600">Joined</th>
								<th className="text-center px-4 py-3 font-semibold text-gray-600">Actions</th>
							</tr>
						</thead>
						<tbody>
							{filtered.length === 0 ? (
								<tr>
									<td colSpan={8} className="text-center py-12 text-gray-400">
										No users found
									</td>
								</tr>
							) : (
								filtered.map((u) => (
									<tr
										key={u.id}
										className="border-b border-gray-100 hover:bg-gray-50 transition-colors cursor-pointer"
										onClick={() => setSelectedUser(u)}
									>
										<td className="px-4 py-3 font-medium text-deepBlue">{u.name}</td>
										<td className="px-4 py-3 text-gray-600">{u.email}</td>
										<td className="px-4 py-3">{roleBadge(u.role)}</td>
										<td className="px-4 py-3 text-gray-600">{u.companyName}</td>
										<td className="px-4 py-3 text-gray-600">{u._count.booths}</td>
										<td className="px-4 py-3 text-gray-600">{u._count.invoices}</td>
										<td className="px-4 py-3 text-gray-500 text-xs">
											{new Date(u.createdAt).toLocaleDateString()}
										</td>
										<td className="px-4 py-3 text-center">
											<button
												onClick={(e) => {
													e.stopPropagation();
													setSelectedUser(u);
												}}
												className="text-maroon hover:text-gold text-xs font-semibold"
											>
												View
											</button>
										</td>
									</tr>
								))
							)}
						</tbody>
					</table>
				</div>
				<div className="px-4 py-3 border-t border-gray-200 text-xs text-gray-500">
					Showing {filtered.length} of {users.length} users
				</div>
			</div>

			{/* Detail Modal */}
			{selectedUser && (
				<div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setSelectedUser(null)}>
					<div
						className="bg-white rounded-2xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto"
						onClick={(e) => e.stopPropagation()}
					>
						<div className="flex items-center justify-between p-6 border-b border-gray-200">
							<h3 className="text-lg font-bold text-deepBlue font-poppins">User Details</h3>
							<button onClick={() => setSelectedUser(null)} className="text-gray-400 hover:text-gray-600">
								<XIcon className="h-5 w-5" />
							</button>
						</div>

						<div className="p-6 space-y-4">
							<div className="flex items-center gap-3">
								<div className="w-12 h-12 rounded-full bg-maroon/10 flex items-center justify-center text-maroon font-bold text-lg">
									{selectedUser.name.charAt(0).toUpperCase()}
								</div>
								<div>
									<h4 className="font-bold text-deepBlue text-lg">{selectedUser.name}</h4>
									{roleBadge(selectedUser.role)}
								</div>
							</div>

							<div className="grid grid-cols-1 gap-3 text-sm">
								<div className="flex items-center gap-2 text-gray-600">
									<MailIcon className="h-4 w-4 text-gray-400" />
									{selectedUser.email}
								</div>
								<div className="flex items-center gap-2 text-gray-600">
									<PhoneIcon className="h-4 w-4 text-gray-400" />
									{selectedUser.phone || "N/A"}
								</div>
								<div className="flex items-center gap-2 text-gray-600">
									<BuildingIcon className="h-4 w-4 text-gray-400" />
									{selectedUser.companyName}
								</div>
								{(selectedUser.exhibitorCategory || selectedUser.category || selectedUser.sponsorLevel) && (
									<div className="flex items-center gap-2 text-gray-600">
										<UsersIcon className="h-4 w-4 text-gray-400" />
										{selectedUser.role === "SPONSOR"
											? `Sponsor Category: ${selectedUser.sponsorLevel || "Not set"}`
											: `Exhibitor Category: ${selectedUser.exhibitorCategory || selectedUser.category || "Not set"}`}
									</div>
								)}
								<div className="flex items-center gap-2 text-gray-600">
									<CalendarIcon className="h-4 w-4 text-gray-400" />
									Joined {new Date(selectedUser.createdAt).toLocaleDateString()}
								</div>
							</div>

							<div className="grid grid-cols-2 gap-3">
								<div className="bg-blue-50 rounded-lg p-3 text-center">
									<LayoutGridIcon className="h-5 w-5 text-blue-600 mx-auto mb-1" />
									<p className="text-xl font-bold text-blue-700">{selectedUser._count.booths}</p>
									<p className="text-xs text-blue-500">Booths</p>
								</div>
								<div className="bg-green-50 rounded-lg p-3 text-center">
									<FileTextIcon className="h-5 w-5 text-green-600 mx-auto mb-1" />
									<p className="text-xl font-bold text-green-700">{selectedUser._count.invoices}</p>
									<p className="text-xs text-green-500">Invoices</p>
								</div>
							</div>

							{/* Change Role */}
							<div className="border-t border-gray-200 pt-4">
								<label className="block text-sm font-semibold text-gray-700 mb-2">Change Role</label>
								<select
									value={selectedUser.role}
									onChange={(e) => handleChangeRole(selectedUser.id, e.target.value)}
									disabled={changingRole === selectedUser.id}
									className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-maroon/20 focus:border-maroon outline-none disabled:opacity-50"
								>
									<option value="EXHIBITOR">Exhibitor</option>
									<option value="SPONSOR">Sponsor</option>
									<option value="ADMIN">Admin</option>
								</select>
								{changingRole === selectedUser.id && (
									<p className="text-xs text-gray-400 mt-1 flex items-center gap-1">
										<Loader2Icon className="h-3 w-3 animate-spin" /> Updating...
									</p>
								)}
							</div>

							{/* Delete */}
							<div className="border-t border-gray-200 pt-4">
								{deleteConfirm === selectedUser.id ? (
									<div className="bg-red-50 border border-red-200 rounded-lg p-3">
										<p className="text-sm text-red-700 font-medium mb-2">
											Are you sure? This will permanently delete this user and all their data.
										</p>
										<div className="flex gap-2">
											<button
												onClick={() => handleDelete(selectedUser.id)}
												className="bg-red-600 text-white px-4 py-1.5 rounded-md text-sm font-medium hover:bg-red-700"
											>
												Confirm Delete
											</button>
											<button
												onClick={() => setDeleteConfirm(null)}
												className="bg-gray-200 text-gray-700 px-4 py-1.5 rounded-md text-sm font-medium hover:bg-gray-300"
											>
												Cancel
											</button>
										</div>
									</div>
								) : (
									<button
										onClick={() => setDeleteConfirm(selectedUser.id)}
										className="flex items-center gap-2 text-red-600 hover:text-red-700 text-sm font-medium"
									>
										<TrashIcon className="h-4 w-4" />
										Delete User
									</button>
								)}
							</div>
						</div>
					</div>
				</div>
			)}
		</div>
	);
}
