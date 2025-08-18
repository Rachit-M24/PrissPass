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
                .ForMember(dest => dest.VaultId, opt => opt.Ignore()) // Ignored as it’s set by the service layer
                .ForMember(dest => dest.ItemId, opt => opt.Ignore()) // Ignored as it’s set by the database
                .ForMember(dest => dest.Vaults, opt => opt.Ignore()) // Navigation property, not mapped directly
                .ForMember(dest => dest.Items, opt => opt.MapFrom(src => new Items
                {
                    EncryptedSiteName = src.SiteName,
                    EncryptedUrl = src.Url,
                    EncryptedPassword = src.Password,
                    EncryptedNotes = src.Notes
                }));

            // VaultItem to VaultItemResponse (for retrieving)
            CreateMap<VaultItem, VaultItemResponse>()
                .ForMember(dest => dest.VaultId, opt => opt.MapFrom(src => src.VaultId))
                .ForMember(dest => dest.SiteName, opt => opt.MapFrom(src => src.Items.EncryptedSiteName))
                .ForMember(dest => dest.Url, opt => opt.MapFrom(src => src.Items.EncryptedUrl))
                .ForMember(dest => dest.Password, opt => opt.MapFrom(src => src.Items.EncryptedPassword))
                .ForMember(dest => dest.Notes, opt => opt.MapFrom(src => src.Items.EncryptedNotes));
        }
    }
}
