export function getRoleBadgeClass(role: string) {
  if (role === "admin") return "bg-blue-500 text-white";
  if (role === "doctor") return "bg-green-500 text-white";
  if (role === "nurse") return "bg-purple-500 text-white";
  if (role === "receptionist") return "bg-yellow-500 text-black";
  return "bg-gray-500 text-white";
}
