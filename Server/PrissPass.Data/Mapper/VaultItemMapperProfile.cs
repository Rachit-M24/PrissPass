using AutoMapper;
using PrissPass.Data.Models.Dto;
using PrissPass.Data.Models.Entity;

namespace PrissPass.Data.Mapper
{
    public class VaultItemMapperProfile : Profile
    {
        public VaultItemMapperProfile()
        {
            // Items mapping
            CreateMap<VaultItemRequest, Items>()
                .ForMember(dest => dest.ItemId, opt => opt.MapFrom(_ => Guid.NewGuid()))
                .ForMember(dest => dest.EncryptedSiteName, opt => opt.Ignore()) 
                .ForMember(dest => dest.EncryptedUrl, opt => opt.Ignore())      
                .ForMember(dest => dest.EncryptedPassword, opt => opt.Ignore()) 
                .ForMember(dest => dest.EncryptedNotes, opt => opt.Ignore())    
                .ForMember(dest => dest.CreatedDate, opt => opt.MapFrom(_ => DateTime.UtcNow))
                .ForMember(dest => dest.ModifiedDate, opt => opt.MapFrom(_ => DateTime.UtcNow))
                .ForMember(dest => dest.VaultItems, opt => opt.Ignore());

            // VaultItem mapping
            CreateMap<VaultItemRequest, VaultItem>()
                .ForMember(dest => dest.VaultItemId, opt => opt.MapFrom(_ => Guid.NewGuid()))
                .ForMember(dest => dest.VaultId, opt => opt.Ignore())
                .ForMember(dest => dest.ItemId, opt => opt.Ignore())
                .ForMember(dest => dest.Items, opt => opt.Ignore())
                .ForMember(dest => dest.Vaults, opt => opt.Ignore());

            // Response mapping
            CreateMap<VaultItem, VaultItemResponse>()
                .ForMember(dest => dest.VaultItemId, opt => opt.MapFrom(src => src.VaultItemId))
                .ForMember(dest => dest.SiteName, opt => opt.MapFrom(src => src.Items.EncryptedSiteName))
                .ForMember(dest => dest.Url, opt => opt.MapFrom(src => src.Items.EncryptedUrl))
                .ForMember(dest => dest.Password, opt => opt.MapFrom(src => src.Items.EncryptedPassword))
                .ForMember(dest => dest.Notes, opt => opt.MapFrom(src => src.Items.EncryptedNotes));
        }
    }
}