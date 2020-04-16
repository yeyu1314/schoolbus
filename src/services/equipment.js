import request from '@/utils/request';
import { BaseUrl} from '@/config';
import School_Api from './school';

export const eqApiList = {
  getBusUrl: `${BaseUrl}/cmn/company/`,// 根据公司id查询车辆
  addEquipmentUrl: `${BaseUrl}/cmn/device/heils`,// 添加设备
  getEquipmentListUrl : `${BaseUrl}/cmn/device/heils/list?@page&@page_size`,// 查询设备
  delEquipmentUrl : `${BaseUrl}/cmn/device/heils/`,// 删除设备
  updateEquipmentUrl : `${BaseUrl}/cmn/device/heils`,// 修改更新设备

}
export default eqApiList;

export async function getBusLists(companyId) {// 根据公司id查询车辆
  const url = `${eqApiList.getBusUrl + companyId  }/bus`;
  return request(url)
}

export async function addEquipments(body) {// 添加设备
  return request(eqApiList.addEquipmentUrl,{
    method: 'POST',
    data:{
      method: 'post',
      ...body,
    }
  })
}

export async function getEquipmentlists({page,pageSize}) {
  const url = eqApiList.getEquipmentListUrl
    .replace('@page', page ? `page=${page}&` : '')
    .replace('@page_size', pageSize ? `page_size=${pageSize}&` : '');
  return request(url);
}

export async function delEquipments(body) {
  const url  = `${eqApiList.delEquipmentUrl + body.id  }?deviceId=${  body.device_id}`
  return request(url,{
    method: 'DELETE',
    data:{
      method: 'delete',
    }
  })
}

export async function updateEquipmentlists(body) {
  return request(eqApiList.updateEquipmentUrl,{
    method: 'PUT',
    data:{
      method: 'put',
      ...body,
    }
  })
}
