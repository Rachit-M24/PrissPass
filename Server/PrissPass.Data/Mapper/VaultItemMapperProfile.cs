using AutoMapper;
using PrissPass.Data.Models.Dto;
using PrissPass.Data.Models.Entity;

namespace PrissPass.Data.Mapper
{
    public class VaultItemMapperProfile : Profile
    {
        public VaultItemMapperProfile()
        {
            // VaultItemRequest to VaultItem (for creating/updating)
            CreateMap<VaultItemRequest, VaultItem>()
                .ForMember(dest => dest.VaultItemId, opt => opt.Ignore()) 
                .ForMember(dest => dest.ItemId, opt => opt.Ignore()) 
                .ForMember(dest => dest.Vaults, opt => opt.Ignore())
                .ForMember(dest => dest.Items, opt => opt.MapFrom(src => new Items
                {
                    EncryptedSiteName = src.SiteName,
                    EncryptedUrl = src.Url,
                    EncryptedPassword = src.Password,
                    EncryptedNotes = src.Notes
                }));

            // VaultItem to VaultItemResponse (for retrieving)
            CreateMap<VaultItem, VaultItemResponse>()
                .ForMember(dest => dest.VaultItemId, opt => opt.MapFrom(src => src.VaultItemId))
                .ForMember(dest => dest.SiteName, opt => opt.MapFrom(src => src.Items.EncryptedSiteName))
                .ForMember(dest => dest.Url, opt => opt.MapFrom(src => src.Items.EncryptedUrl))
                .ForMember(dest => dest.Password, opt => opt.MapFrom(src => src.Items.EncryptedPassword))
                .ForMember(dest => dest.Notes, opt => opt.MapFrom(src => src.Items.EncryptedNotes));
        }
    }
}
